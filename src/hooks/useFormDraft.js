/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { staffApi } from "../services/api";

const DRAFT_SCHEMA_VERSION = 1;
const DRAFT_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const STORAGE_PREFIX = "akshar-form-draft";

function userPart(user = {}) {
  return String(user._id || user.id || user.email || "staff");
}

function normalizeRecordId(recordId) {
  return String(recordId || "new").trim() || "new";
}

function draftKey({ user, formType, mode, recordId }) {
  return [STORAGE_PREFIX, DRAFT_SCHEMA_VERSION, userPart(user), user?.role || "staff", formType, mode, normalizeRecordId(recordId)].join(":");
}

function isExpired(draft) {
  return draft?.expiresAt && new Date(draft.expiresAt).getTime() <= Date.now();
}

function safeJson(value) {
  try {
    return JSON.stringify(value ?? {});
  } catch {
    return "{}";
  }
}

function localRead(key) {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const draft = JSON.parse(raw);
    if (!draft || draft.schemaVersion !== DRAFT_SCHEMA_VERSION || isExpired(draft)) {
      window.localStorage.removeItem(key);
      return null;
    }
    return draft;
  } catch {
    window.localStorage.removeItem(key);
    return null;
  }
}

function localWrite(key, draft) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(draft));
  } catch {
    // Backend sync still protects the draft when local storage quota is unavailable.
  }
}

function localDelete(key) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage cleanup failures.
  }
}

function toClientDraft(serverDraft) {
  if (!serverDraft) return null;
  return {
    ...serverDraft,
    source: "backend",
    updatedAt: serverDraft.updatedAt || serverDraft.createdAt,
    schemaVersion: serverDraft.schemaVersion || DRAFT_SCHEMA_VERSION,
  };
}

function newestDraft(first, second) {
  if (!first) return second || null;
  if (!second) return first;
  return new Date(second.updatedAt || 0).getTime() > new Date(first.updatedAt || 0).getTime() ? second : first;
}

export function useFormDraft({
  enabled = true,
  formType,
  mode = "create",
  recordId = "new",
  user,
  payload,
  onRestore,
  shouldSave = () => true,
  debounceMs = 800,
}) {
  const storageKey = useMemo(() => draftKey({ user, formType, mode, recordId }), [formType, mode, recordId, user]);
  const draftParams = useMemo(() => ({ formType, mode, recordId: normalizeRecordId(recordId) }), [formType, mode, recordId]);
  const serializedPayload = useMemo(() => safeJson(payload), [payload]);
  const payloadRef = useRef(payload);
  const serializedRef = useRef(serializedPayload);
  const initialSerializedRef = useRef(serializedPayload);
  const shouldSaveRef = useRef(shouldSave);
  const onRestoreRef = useRef(onRestore);
  const remoteTimerRef = useRef(null);
  const suppressSaveRef = useRef(false);
  const [availableDraft, setAvailableDraft] = useState(null);
  const [restorePending, setRestorePending] = useState(false);
  const [status, setStatus] = useState("idle");
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [ready, setReady] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    payloadRef.current = payload;
    serializedRef.current = serializedPayload;
    shouldSaveRef.current = shouldSave;
    onRestoreRef.current = onRestore;
  }, [onRestore, payload, serializedPayload, shouldSave]);

  const buildDraft = useCallback(() => {
    const now = new Date();
    return {
      ...draftParams,
      draftKey: storageKey,
      payload: payloadRef.current,
      schemaVersion: DRAFT_SCHEMA_VERSION,
      updatedAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + DRAFT_TTL_MS).toISOString(),
      source: "local",
    };
  }, [draftParams, storageKey]);

  const saveLocal = useCallback(() => {
    if (suppressSaveRef.current) return null;
    if (!enabled || !shouldSaveRef.current(payloadRef.current)) return null;
    const draft = buildDraft();
    localWrite(storageKey, draft);
    setLastSavedAt(draft.updatedAt);
    return draft;
  }, [buildDraft, enabled, storageKey]);

  const saveNow = useCallback(async () => {
    const draft = saveLocal();
    if (!draft) return false;
    setStatus("saving");
    try {
      const response = await staffApi.saveFormDraft({
        ...draftParams,
        payload: payloadRef.current,
        schemaVersion: DRAFT_SCHEMA_VERSION,
      });
      const saved = toClientDraft(response.data) || draft;
      localWrite(storageKey, { ...draft, ...saved, source: "backend" });
      setStatus("saved");
      setLastSavedAt(saved.updatedAt || draft.updatedAt);
      return true;
    } catch {
      setStatus("error");
      return false;
    }
  }, [draftParams, saveLocal, storageKey]);

  const clearDraft = useCallback(async () => {
    if (remoteTimerRef.current) window.clearTimeout(remoteTimerRef.current);
    suppressSaveRef.current = true;
    localDelete(storageKey);
    setAvailableDraft(null);
    setRestorePending(false);
    setHasChanges(false);
    setStatus("idle");
    try {
      await staffApi.deleteFormDraft(draftParams);
    } catch {
      // Local draft is already gone; a later backend save will use the current key.
    }
  }, [draftParams, storageKey]);

  const discardDraft = useCallback(async () => {
    await clearDraft();
    initialSerializedRef.current = serializedRef.current;
    setReady(true);
  }, [clearDraft]);

  const restoreDraft = useCallback(() => {
    if (!availableDraft?.payload) return;
    suppressSaveRef.current = false;
    onRestoreRef.current?.(availableDraft.payload);
    setRestorePending(false);
    setAvailableDraft(null);
    setReady(true);
    setStatus("saved");
    setLastSavedAt(availableDraft.updatedAt || availableDraft.createdAt || null);
    initialSerializedRef.current = "";
  }, [availableDraft]);

  useEffect(() => {
    if (!enabled || !formType || !user) return undefined;
    let active = true;
    const localDraft = localRead(storageKey);
    initialSerializedRef.current = serializedRef.current;
    setReady(!localDraft);
    setRestorePending(Boolean(localDraft));
    setAvailableDraft(localDraft);
    setStatus(localDraft ? "saved" : "idle");
    setLastSavedAt(localDraft?.updatedAt || null);
    suppressSaveRef.current = false;

    staffApi
      .formDraft(draftParams)
      .then((response) => {
        if (!active) return;
        const backendDraft = toClientDraft(response.data);
        const nextDraft = newestDraft(localDraft, backendDraft);
        if (nextDraft && !isExpired(nextDraft)) {
          setAvailableDraft(nextDraft);
          setRestorePending(true);
          setReady(false);
          setStatus("saved");
          setLastSavedAt(nextDraft.updatedAt || null);
        } else {
          setReady(true);
        }
      })
      .catch(() => {
        if (active) setReady(true);
      });

    return () => {
      active = false;
      if (remoteTimerRef.current) window.clearTimeout(remoteTimerRef.current);
    };
  }, [draftParams, enabled, formType, storageKey, user]);

  useEffect(() => {
    if (ready && !restorePending && serializedPayload !== initialSerializedRef.current) {
      suppressSaveRef.current = false;
    }
  }, [ready, restorePending, serializedPayload]);

  useEffect(() => {
    if (!enabled || !ready || restorePending) return undefined;
    const meaningful = shouldSaveRef.current(payloadRef.current);
    const changed = serializedRef.current !== initialSerializedRef.current;
    setHasChanges(Boolean(meaningful && changed));
    if (!meaningful || !changed) return undefined;

    setStatus("saving");
    if (remoteTimerRef.current) window.clearTimeout(remoteTimerRef.current);
    remoteTimerRef.current = window.setTimeout(() => {
      saveNow();
    }, debounceMs);

    return () => {
      if (remoteTimerRef.current) window.clearTimeout(remoteTimerRef.current);
    };
  }, [debounceMs, enabled, ready, restorePending, saveNow, serializedPayload]);

  useEffect(() => {
    if (!enabled || !ready || restorePending) return undefined;
    const handleBeforeUnload = (event) => {
      if (!shouldSaveRef.current(payloadRef.current)) return;
      saveLocal();
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      if (shouldSaveRef.current(payloadRef.current)) saveLocal();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [enabled, ready, restorePending, saveLocal]);

  return {
    availableDraft,
    restorePending,
    status,
    lastSavedAt,
    hasChanges,
    saveNow,
    restoreDraft,
    discardDraft,
    clearDraft,
  };
}

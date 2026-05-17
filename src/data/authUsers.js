export const testCredentials = [];

export function findCredential(email, password) {
  return testCredentials.find(
    (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password
  );
}

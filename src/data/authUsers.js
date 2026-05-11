export const testCredentials = [
  {
    email: "admin@aksharrealestate.test",
    password: "Admin@12345",
    name: "Akshar Real Estate Admin",
    role: "admin",
    dashboardPath: "/admin-dashboard",
  },
  {
    email: "supervisor@aksharrealestate.test",
    password: "Supervisor@12345",
    name: "Akshar Real Estate Supervisor",
    role: "supervisor",
    dashboardPath: "/supervisor-dashboard",
  },
];

export function findCredential(email, password) {
  return testCredentials.find(
    (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password
  );
}

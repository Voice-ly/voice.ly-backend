import { User } from "../../src/models/user.model";

describe("User Model (Type Interface)", () => {

  it("should define the required fields", () => {
    const user: User = {
      firstName: "John",
      email: "john@example.com",
      createdAt: new Date(),
      password: "hashed_pass"
    };

    expect(user.firstName).toBeDefined();
    expect(user.email).toBeDefined();
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.password).toBeDefined();
  });

  it("should allow optional fields", () => {
    const user: User = {
      firstName: "Ana",
      lastName: "Perez",
      age: 30,
      email: "ana@test.com",
      createdAt: new Date(),
      password: "hashed_pass"
    };

    expect(user.age).toBe(30);
    expect(user.lastName).toBe("Perez");
  });
});

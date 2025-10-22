import { signup } from "./auth.controller.js";
import userModel from "../../DB/models/User.model.js";
import * as dbServices from "../../DB/db.services.js";
import * as hashServices from "../../utils/secuirty/hash.services.js";
import * as tokenServices from "../../utils/secuirty/token.services.js";
import { sendEmailEvent } from "../../Events/sendEmail.event.js";
import * as responseUtils from "../../utils/Response.js";

describe("Auth Controller - Signup", () => {
    let req, res, next;
    let findOneSpy, createSpy, genrateHashSpy, generateEmailTokensSpy, 
        successResponceSpy, emitSpy;

    beforeEach(() => {
        // Setup mock request, response, and next
        req = {
            body: {
                email: "test@example.com",
                password: "password123",
                firstName: "John",
                secondName: "Doe"
            }
        };

        res = {
            status: jasmine.createSpy("status").and.returnValue({
                json: jasmine.createSpy("json")
            }),
            json: jasmine.createSpy("json")
        };

        next = jasmine.createSpy("next");

        // Setup environment variable
        process.env.HASH_SALT_ROUND = "10";

        // Create spies for all dependencies
        findOneSpy = spyOn(dbServices, 'findOne');
        createSpy = spyOn(dbServices, 'create');
        genrateHashSpy = spyOn(hashServices, 'genrateHash');
        generateEmailTokensSpy = spyOn(tokenServices, 'generateEmailTokens');
        successResponceSpy = spyOn(responseUtils, 'successResponce');
        emitSpy = spyOn(sendEmailEvent, 'emit');
    });

    describe("Successful signup", () => {
        it("should create a new user and send success response", async () => {
            // Arrange
            const hashedPassword = "hashedPassword123";
            const mockUser = {
                _id: "user123",
                email: req.body.email,
                firstName: req.body.firstName,
                secondName: req.body.secondName,
                password: hashedPassword
            };
            const mockToken = { accessToken: "emailToken123" };

            findOneSpy.and.returnValue(Promise.resolve(null)); // User doesn't exist
            genrateHashSpy.and.returnValue(Promise.resolve(hashedPassword));
            generateEmailTokensSpy.and.returnValue(mockToken);
            createSpy.and.returnValue(Promise.resolve(mockUser));

            // Act
            await signup(req, res, next);

            // Assert
            expect(findOneSpy).toHaveBeenCalledWith({
                model: userModel,
                filter: { email: req.body.email }
            });
            expect(genrateHashSpy).toHaveBeenCalledWith({
                plainText: "password123",
                saltRound: 10
            });
            expect(generateEmailTokensSpy).toHaveBeenCalledWith(
                jasmine.objectContaining({
                    email: req.body.email,
                    password: hashedPassword
                })
            );
            expect(emitSpy).toHaveBeenCalledWith(
                "confirmEmail",
                jasmine.objectContaining({
                    to: req.body.email
                })
            );
            expect(createSpy).toHaveBeenCalledWith({
                model: userModel,
                data: jasmine.objectContaining({
                    email: req.body.email,
                    password: hashedPassword
                })
            });
            expect(successResponceSpy).toHaveBeenCalledWith({
                res: res,
                data: mockUser
            });
            expect(next).not.toHaveBeenCalled();
        });
    });

    // describe("User already exists", () => {
    //     it("should return 409 error if user already exists", async () => {
    //         // Arrange
    //         const existingUser = {
    //             _id: "existingUser123",
    //             email: req.body.email
    //         };
    //         findOneSpy.and.returnValue(Promise.resolve(existingUser));

    //         // Act
    //         await signup(req, res, next);

    //         // Assert
    //         expect(findOneSpy).toHaveBeenCalledWith({
    //             model: userModel,
    //             filter: { email: req.body.email }
    //         });
    //         expect(next).toHaveBeenCalled();
    //         const errorArg = next.calls.argsFor(0)[0];
    //         expect(errorArg).toBeInstanceOf(Error);
    //         expect(errorArg.message).toBe("User already Exsits");
    //         expect(errorArg.cause).toBe(409);
    //         expect(genrateHashSpy).not.toHaveBeenCalled();
    //         expect(createSpy).not.toHaveBeenCalled();
    //     });
    // });

    // describe("Missing password", () => {
    //     it("should return 400 error if password is missing", async () => {
    //         // Arrange
    //         req.body.password = "";
    //         findOneSpy.and.returnValue(Promise.resolve(null));

    //         // Act
    //         await signup(req, res, next);

    //         // Assert
    //         expect(next).toHaveBeenCalled();
    //         const errorArg = next.calls.argsFor(0)[0];
    //         expect(errorArg).toBeInstanceOf(Error);
    //         expect(errorArg.message).toBe("there is no passowrd");
    //         expect(errorArg.cause).toBe(400);
    //         expect(createSpy).not.toHaveBeenCalled();
    //     });

    //     it("should return 400 error if password is undefined", async () => {
    //         // Arrange
    //         delete req.body.password;
    //         findOneSpy.and.returnValue(Promise.resolve(null));

    //         // Act
    //         await signup(req, res, next);

    //         // Assert
    //         expect(next).toHaveBeenCalled();
    //         const errorArg = next.calls.argsFor(0)[0];
    //         expect(errorArg).toBeInstanceOf(Error);
    //         expect(errorArg.message).toBe("there is no passowrd");
    //         expect(errorArg.cause).toBe(400);
    //     });
    // });

    // describe("Password hashing", () => {
    //     it("should hash the password before saving", async () => {
    //         // Arrange
    //         const hashedPassword = "hashed_password_xyz";
    //         findOneSpy.and.returnValue(Promise.resolve(null));
    //         genrateHashSpy.and.returnValue(Promise.resolve(hashedPassword));
    //         generateEmailTokensSpy.and.returnValue({ accessToken: "token" });
    //         createSpy.and.returnValue(Promise.resolve({ _id: "user123" }));

    //         // Act
    //         await signup(req, res, next);

    //         // Assert
    //         expect(genrateHashSpy).toHaveBeenCalledWith({
    //             plainText: "password123",
    //             saltRound: 10
    //         });
    //         expect(req.body.password).toBe(hashedPassword);
    //     });
    // });

    // describe("Email verification", () => {
    //     it("should send email verification if email is provided", async () => {
    //         // Arrange
    //         const mockToken = { accessToken: "emailVerificationToken" };
    //         findOneSpy.and.returnValue(Promise.resolve(null));
    //         genrateHashSpy.and.returnValue(Promise.resolve("hashedPass"));
    //         generateEmailTokensSpy.and.returnValue(mockToken);
    //         createSpy.and.returnValue(Promise.resolve({ _id: "user123" }));

    //         // Act
    //         await signup(req, res, next);

    //         // Assert
    //         expect(generateEmailTokensSpy).toHaveBeenCalledWith(
    //             jasmine.objectContaining({
    //                 email: req.body.email
    //             })
    //         );
    //         expect(emitSpy).toHaveBeenCalledWith(
    //             "confirmEmail",
    //             jasmine.objectContaining({
    //                 to: req.body.email,
    //                 html: jasmine.any(String)
    //             })
    //         );
    //     });

    //     it("should not send email if email is not provided", async () => {
    //         // Arrange
    //         delete req.body.email;
    //         req.body.email = null;
    //         findOneSpy.and.returnValue(Promise.resolve(null));
    //         genrateHashSpy.and.returnValue(Promise.resolve("hashedPass"));
    //         createSpy.and.returnValue(Promise.resolve({ _id: "user123" }));

    //         // Act
    //         await signup(req, res, next);

    //         // Assert
    //         expect(generateEmailTokensSpy).not.toHaveBeenCalled();
    //         expect(emitSpy).not.toHaveBeenCalled();
    //     });
    // });

    // describe("Database operations", () => {
    //     it("should handle database errors gracefully", async () => {
    //         // Arrange
    //         const dbError = new Error("Database connection failed");
    //         findOneSpy.and.returnValue(Promise.reject(dbError));

    //         // Act & Assert
    //         await expectAsync(signup(req, res, next)).toBeRejected();
    //     });

    //     it("should pass correct data to create function", async () => {
    //         // Arrange
    //         const hashedPassword = "hashed123";
    //         findOneSpy.and.returnValue(Promise.resolve(null));
    //         genrateHashSpy.and.returnValue(Promise.resolve(hashedPassword));
    //         generateEmailTokensSpy.and.returnValue({ accessToken: "token" });
    //         createSpy.and.returnValue(Promise.resolve({ _id: "user123" }));

    //         // Act
    //         await signup(req, res, next);

    //         // Assert
    //         expect(createSpy).toHaveBeenCalledWith({
    //             model: userModel,
    //             data: {
    //                 email: req.body.email,
    //                 password: hashedPassword,
    //                 firstName: req.body.firstName,
    //                 secondName: req.body.secondName
    //             }
    //         });
    //     });
    // });

    // describe("Edge cases", () => {
    //     it("should handle empty string password", async () => {
    //         // Arrange
    //         req.body.password = "";
    //         findOneSpy.and.returnValue(Promise.resolve(null));

    //         // Act
    //         await signup(req, res, next);

    //         // Assert
    //         expect(next).toHaveBeenCalled();
    //         const errorArg = next.calls.argsFor(0)[0];
    //         expect(errorArg.message).toBe("there is no passowrd");
    //     });

    //     it("should handle null password", async () => {
    //         // Arrange
    //         req.body.password = null;
    //         findOneSpy.and.returnValue(Promise.resolve(null));

    //         // Act
    //         await signup(req, res, next);

    //         // Assert
    //         expect(next).toHaveBeenCalled();
    //         const errorArg = next.calls.argsFor(0)[0];
    //         expect(errorArg.message).toBe("there is no passowrd");
    //     });

    //     it("should handle special characters in email", async () => {
    //         // Arrange
    //         req.body.email = "test+special@example.com";
    //         findOneSpy.and.returnValue(Promise.resolve(null));
    //         genrateHashSpy.and.returnValue(Promise.resolve("hashed"));
    //         generateEmailTokensSpy.and.returnValue({ accessToken: "token" });
    //         createSpy.and.returnValue(Promise.resolve({ _id: "user123" }));

    //         // Act
    //         await signup(req, res, next);

    //         // Assert
    //         expect(findOneSpy).toHaveBeenCalledWith({
    //             model: userModel,
    //             filter: { email: "test+special@example.com" }
    //         });
    //     });
    // });
});

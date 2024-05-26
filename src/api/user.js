const { Router } = require("express");
const User = require("../persistence/users");

const bcrypt = require("bcrypt");

const router = new Router();

// id uuid PRIMARY KEY,
//     identifier text,
//     first_name text,
//     last_name text,
//     organization text,
//     address text,
//     email text UNIQUE,
//     password text,
//     role text

router.post("/", async (request, response) => {
  console.log(request.body);
  try {
    const {
      identifier,
      first_name,
      last_name,
      organization,
      address,
      email,
      password,
      role,
    } = request.body;

    if (
      !email ||
      !password ||
      !role ||
      !identifier ||
      !first_name ||
      !last_name ||
      !organization ||
      !address
    ) {
      return response
        .status(400)
        .json({ message: "Email and password must be provided" });
    }

    const user = await User.create(
      email,
      password,
      role,
      identifier,
      first_name,
      last_name,
      organization,
      address
    );
    if (!user) {
      return response.status(400).json({ message: "User already exists" });
    }

    return response
      .status(201)
      .json({ ...user, status: "registered successfully" });
  } catch (error) {
    console.error(
      `createUser({ email: ${request.body.email} }) >> Error: ${error.stack}`
    );
    response.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async (request, response) => {
  try {
    const { email, password } = request.body;
    const user = await User.find(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return response.status(403).json({
        message: "Invalid email or password",
      });
    }
    return response.status(200).json({ ...user, status: "logged in" });
  } catch (error) {
    console.error(error);
  }
});

router.get("/", async (request, response) => {
  try {
    const users = await User.findAll();
    return response.status(200).json(users);
  } catch (error) {
    console.error(`getAllUsers() >> Error: ${error.stack}`);
    response.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const user = await User.remove(id);
    return response.status(200).json(user);
  } catch (error) {
    console.error(
      `removeUser({ id: ${request.params.id} }) >> Error: ${error}`
    );
    response.status(500).json({ message: "Internal Server Error" });
  }
});
// router.get("/:email", async (request, response) => {
//   try {
//     const { email } = request.params;
//     const user = await User.find(email);

//     if (!user) {
//       return response.status(404).json({ message: "User not found" });
//     }

//     return response.status(200).json(user);
//   } catch (error) {
//     console.error(
//       `getUserById({ id: ${request.params.id} }) >> Error: ${error.stack}`
//     );
//     response.status(500).json({ message: "Internal Server Error" });
//   }
// });

// router.post("/:id/shifts", async (request, response) => {
//   try {
//     const { id } = request.params;
//     const { shiftTime, description } = request.body;

//     const shift = await User.addShift(id, shiftTime, description);
//     return response.status(201).json(shift);
//   } catch (error) {
//     console.error(
//       `addShift({ userId: ${request.params.id} }) >> Error: ${error.stack}`
//     );
//     response.status(500).json({ message: "Internal Server Error" });
//   }
// });

// // GET endpoint to get shifts for a user
// router.get("/:id/shifts", async (request, response) => {
//   try {
//     const { id } = request.params;

//     const shifts = await User.getShifts(id);
//     return response.status(200).json(shifts);
//   } catch (error) {
//     console.error(
//       `getShifts({ userId: ${request.params.id} }) >> Error: ${error.stack}`
//     );
//     response.status(500).json({ message: "Internal Server Error" });
//   }
// });
module.exports = router;

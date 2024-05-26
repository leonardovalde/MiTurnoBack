const { Router } = require("express");
const User = require("../persistence/users");

const router = new Router();

router.post("/getShifts", async (request, response) => {
  try {
    const { id } = request.body;
    if (!id) {
      return response.status(400).json({ message: "User id must be provided" });
    } else {
      const shifts = await User.findById(id);
      console.log(shifts);
      if (shifts.role === "admin") {
        const allShifts = await User.getAllShifts();
        console.log(allShifts);
        return response.status(200).json(allShifts);
      } else {
        const myShifts = await User.getMyShifts(id);
        console.log(myShifts);
        return response.status(200).json(myShifts);
      }
    }
  } catch (error) {
    console.error(
      `getShifts({ userId: ${request.params.id} }) >> Error: ${error.stack}`
    );
    response.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/addShift", async (request, response) => {
  try {
    const { userId, shiftTime, description, providerId } = request.body;
    if ((!userId, !shiftTime, !description, !providerId)) {
      return response.status(400).json({ message: "User id must be provided" });
    } else {
      const shift = await User.addShift(
        userId,
        shiftTime,
        description,
        providerId
      );
      return response.status(201).json(shift);
    }
  } catch (error) {
    console.error(
      `addShift({ userId: ${request.params.id} }) >> Error: ${error.stack}`
    );
    response.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/deleteShift", async (request, response) => {
  try {
    const { id } = request.body;
    if (!id) {
      return response.status(400).json({ message: "User id must be provided" });
    } else {
      const shift = await User.deleteShift(id);
      return response.status(200).json({
        message: "Shift deleted successfully",
      });
    }
  } catch (error) {
    console.error(
      `deleteShift({ userId: ${request.params.id} }) >> Error: ${error.stack}`
    );
    response.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;

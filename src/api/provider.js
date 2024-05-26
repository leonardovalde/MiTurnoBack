const { Router } = require("express");
const User = require("../persistence/users");

const router = new Router();

router.post("/", async (request, response) => {
  try {
    const { name, description, provider_image } = request.body;
    if (!name || !description || !provider_image) {
      return response.status(400).json({ message: "User id must be provided" });
    } else {
      const provider = await User.createProvider(
        name,
        description,
        provider_image
      );
      return response.status(201).json(provider);
    }
  } catch (error) {
    console.error(
      `createProvider({ userId: ${request.params.id} }) >> Error: ${error.stack}`
    );
    response.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/", async (request, response) => {
  try {
    const providers = await User.getProviders();
    return response.status(200).json(providers);
  } catch (error) {
    console.error(
      `createProvider({ userId: ${request.params.id} }) >> Error: ${error.stack}`
    );
    response.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const provider = await User.deleteProvider(id);
    return response.status(200).json({
      message: "Provider deleted successfully",
    });
  } catch (error) {
    console.error(
      `deleteProvider({ userId: ${request.params.id} }) >> Error: ${error.stack}`
    );
    response.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;

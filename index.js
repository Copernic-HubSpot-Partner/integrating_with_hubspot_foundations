import axios from "axios";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const PORT = 3000;
app.set("view engine", "pug");

app.use(express.static("public"));

const hubspotApi = axios.create({
  baseURL: "https://api.hubapi.com/crm/v3/objects",
  headers: {
    Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
});

// Page d'accueil affichant les objets
app.get("/", async (req, res) => {
  try {
    const response = await hubspotApi.get(
      "/2-139991859?properties=nom&properties=description&properties=category"
    );
    console.log(JSON.stringify(response.data, null, 2));
    res.render("homepage", { objects: response.data.results });
  } catch (error) {
    res.status(500).send("Erreur API HubSpot");
  }
});

// Affichage du formulaire
app.get("/update-cobj", (req, res) => {
  res.render("updates", { title: "Update Custom Object Form" });
});

// Création d'objet
app.post(
  "/update-cobj",
  express.urlencoded({ extended: true }),
  async (req, res) => {
    const { nom, description, category } = req.body;
    try {
      await hubspotApi.post("/2-139991859", {
        properties: { nom, description, category },
      });
      res.redirect("/");
    } catch (error) {
      console.error(error.data);
      res.status(500).send("Erreur lors de l'ajout");
    }
  }
);

// Démarrage d'express
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});

const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function isValidId(request, response, next){
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({error: "Invalid repositorie id"});
  };

  return next();
};


app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {
    title,
    url,
    techs
  } = request.body;

  const repositorie = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repositorie);

  return response.status(201).json(repositorie);

});

app.put("/repositories/:id", isValidId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);
  if( repositorieIndex < 0 ){
    return response.status(400).json({error: "Repositorie not found"});
  };

  const { likes } = repositories[repositorieIndex];
  const repositorieUpdated = {
    id: id,
    title: title,
    url: url,
    techs: techs,
    likes: likes
  };

  repositories.splice(repositorieIndex, 1);
  repositories.push(repositorieUpdated);
  
  return response.json(repositorieUpdated);

});

app.delete("/repositories/:id", isValidId, (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);
  if( repositorieIndex < 0 ){
    return response.status(400).json({error: "Repositorie not found"});
  };

  repositories.splice(repositorieIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", isValidId, (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);
  if( repositorieIndex < 0 ){
    return response.status(400).json({error: "Repositorie not found"});
  };

  const repo = repositories[repositorieIndex];

  const repositorieLiked = {
    ...repo,
    likes: repo.likes + 1
  };

  repositories.splice(repositorieIndex, 1);
  repositories.push(repositorieLiked)

  return response.json(repositorieLiked);
});

module.exports = app;

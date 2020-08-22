"use strict";

var express = require("express");

var cors = require("cors");

var _require = require('uuidv4'),
    uuid = _require.uuid;

var app = express();
app.use(express.json());
app.use(cors());
var repositories = [];
app.get("/repositories", function (request, response) {
  return response.json(repositories);
});
app.post("/repositories", function (request, response) {
  var _request$body = request.body,
      title = _request$body.title,
      url = _request$body.url,
      techs = _request$body.techs;
  var repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  };
  repositories.push(repository);
  return response.json(repository);
});
app.put("/repositories/:id", function (request, response) {
  var id = request.params.id;
  var _request$body2 = request.body,
      title = _request$body2.title,
      url = _request$body2.url,
      techs = _request$body2.techs;
  var repositoryIndex = repositories.findIndex(function (repository) {
    return repository.id === id;
  });

  if (repositoryIndex < 0) {
    return response.status(400).send({
      error: 'Repository not found'
    });
  }

  var repository = {
    id: id,
    title: title,
    url: url,
    techs: techs,
    likes: repositories[repositoryIndex].likes
  };
  repositories[repositoryIndex] = repository;
  return response.json(repository);
});
app["delete"]("/repositories/:id", function (request, response) {
  var id = request.params.id;
  var repositoryIndex = repositories.findIndex(function (repository) {
    return repository.id === id;
  });

  if (repositoryIndex >= 0) {
    repositories.splice(repositoryIndex, 1);
  } else {
    return response.status(400).send({
      error: 'Repository not found.'
    });
  }

  return response.status(204).send();
});
app.post("/repositories/:id/like", function (request, response) {
  var id = request.params.id;
  var repositoryIndex = repositories.findIndex(function (repository) {
    return repository.id === id;
  });

  if (repositoryIndex < 0) {
    return response.status(400).send({
      error: 'Repository not found'
    });
  }

  repositories[repositoryIndex].likes++;
  return response.json(repositories[repositoryIndex]);
});
module.exports = app;
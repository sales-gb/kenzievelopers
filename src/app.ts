import express, { Application, json } from 'express';
import 'dotenv/config';
import {
  registerDev,
  registerDevInfo,
  getDevById,
  updateDev,
  deleteDev,
} from './logic/devLogic';
import { ensureDevExists, ensureEmailExist } from './middlewares/devMiddleware';
import {
  createProject,
  createTech,
  deleteProject,
  deleteTech,
  getProjectById,
  updateProject,
} from './logic/projectLogic';
import {
  ensureProjectExist,
  ensureTechExists,
} from './middlewares/projectsMiddleware';

const app: Application = express();
app.use(json());

app.post('/developers', ensureEmailExist, registerDev);
app.get('/developers/:id', ensureDevExists, getDevById);
app.patch('/developers/:id', ensureDevExists, ensureEmailExist, updateDev);
app.delete('/developers/:id', ensureDevExists, deleteDev);
app.post('/developers/:id/infos', ensureDevExists, registerDevInfo);

app.post('/projects', ensureDevExists, createProject);
app.get('/projects/:id', ensureDevExists, ensureProjectExist, getProjectById);
app.patch('/projects/:id', ensureProjectExist, updateProject);
app.delete('/projects/:id', ensureProjectExist, deleteProject);
app.post(
  '/projects/:id/technologies',
  ensureProjectExist,
  ensureTechExists,
  createTech,
);
app.delete(
  '/projects/:id/technologies/:name',
  ensureProjectExist,
  ensureTechExists,
  deleteTech,
);

export default app;

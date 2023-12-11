import express from 'express';
import task1 from '../queryController/task1.js';
import task10 from '../queryController/task10.js';
import task11 from '../queryController/task11.js';
import task12 from '../queryController/task12.js';
import task13 from '../queryController/task13.js';
import task14 from '../queryController/task14.js';
import task15 from '../queryController/task15.js';
import task16 from '../queryController/task16.js';
import task17 from '../queryController/task17.js';
import task18 from '../queryController/task18.js';
import task19 from '../queryController/task19.js';
import task2 from '../queryController/task2.js';
import task3 from '../queryController/task3.js';
import task4 from '../queryController/task4.js';
import task5 from '../queryController/task5.js';
import task6 from '../queryController/task6.js';
import task7 from '../queryController/task7.js';
import task8 from '../queryController/task8.js';
import task9 from '../queryController/task9.js';
// import { getCustomerOrderCount } from './customerController.js';

const router = express.Router();

router.get('/task1', task1);
router.get('/task2', task2);
router.get('/task3', task3);
router.get('/task4', task4);
router.get('/task5', task5);
router.get('/task6', task6);
router.get('/task7', task7);
router.get('/task8', task8);
router.get('/task9', task9);
router.get('/task10', task10);
router.get('/task11', task11);
router.get('/task12', task12);
router.get('/task13', task13);
router.get('/task14', task14);
router.get('/task15', task15);
router.get('/task16', task16);
router.get('/task17', task17);
router.get('/task18', task18);
router.get('/task19', task19);


export default router;

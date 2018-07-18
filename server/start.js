import schedule from 'node-schedule';
import { neighbourhoodAction } from './action/neighbourhood';


export default async () => {
  try {
    neighbourhoodAction.setInDB();
  } catch (err) {
    console.log(err);
  }
};

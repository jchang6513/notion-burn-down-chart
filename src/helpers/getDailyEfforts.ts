import {Database} from '../models/Database';

type Options = {
  effortsId?: string;
  dateId?: string;
  currentSprintId?: string;
  sprintPeriodId?: string;
  sprintEffortId?: string;
};

const getDaysArray = (start: Date, end: Date) => {
  const arr = [];
  for(let dt=start; dt<=new Date(end); dt.setDate(dt.getDate()+1)){
    arr.push(new Date(dt));
  }
  return arr;
};

export type DailyEffort = {
  day: Date;
  totalEfforts: number;
  remainingEfforts: number;
  idealRemainingEfforts: number;
}

export const getDailyEfforts = (database: Database, sprintData: Database, options: Options = {}) => {
  const {
    effortsId = 'Efforts',
    dateId = 'Date',
    currentSprintId = 'Active',
    sprintPeriodId = 'Period',
    sprintEffortId = 'Total Efforts',
  } = options;

  const currentSprint = sprintData.data.find(sprint => sprint[currentSprintId].checkbox) || {};
  const sprintEffort = currentSprint[sprintEffortId].number;
  const sprintPeriod = currentSprint[sprintPeriodId]?.date;

  if (!sprintPeriod || !sprintPeriod.start || !sprintPeriod.end || !sprintEffort) {
    return {};
  }

  const defaultEffortsObj = getDaysArray(
    new Date(sprintPeriod.start),
    new Date(sprintPeriod.end)
  ).reduce<Record<string, number>>((acc, day) => ({
    ...acc,
    [Number(day)]: 0,
  }), {})

  const effortsObj = database.data.reduce<Record<string, number>>((acc, d) => {
    const date = d[dateId].date;
    const effort = d[effortsId].number;
    if (!date || !date.start || !effort) {
      throw new Error('invalid key of date or efforts')
    }

    const day = String(Number(new Date(date.start)));

    if (acc[day] !== undefined) {
      acc[day] += effort;
    }

    return acc;
  }, defaultEffortsObj);

  const days = Object.keys(effortsObj).sort();
  const totalDays = days.length;
  const idealEfforts = sprintEffort / (totalDays - 1);

  return days.reduce<DailyEffort[]>((acc, day, index) => {
    if (index === 0) {
      return [
        {
          day: new Date(Number(day)),
          totalEfforts: effortsObj[day],
          remainingEfforts: sprintEffort - effortsObj[day],
          idealRemainingEfforts: sprintEffort,
        }
      ]
    } else {
      return [
        ...acc,
        {
          day: new Date(Number(day)),
          totalEfforts: effortsObj[day],
          remainingEfforts: acc[index-1].remainingEfforts - effortsObj[day],
          idealRemainingEfforts: acc[index - 1].idealRemainingEfforts - idealEfforts,
        }
      ]
    }
  }, [])
}

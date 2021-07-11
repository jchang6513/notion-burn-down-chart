import { workspace as defaultWorkspace} from '../helpers/envVariables';
import {convertToDatabase} from '../models/Database';

export async function queryDatabase(
  database: string,
  workspace: string = defaultWorkspace,
) {
  const myHeaders = new Headers();
  myHeaders.append("Notion-Version", "2021-05-13");
  myHeaders.append("Authorization", `Bearer ${workspace}`);

  const urlencoded = new URLSearchParams();

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  } as any;

  const response = await fetch(`https://api.notion.com/v1/databases/${database}/query`, requestOptions);
  const json = await response.json();
  return convertToDatabase(json);
}

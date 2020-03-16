import fs from 'fs'
import { Guid } from "guid-typescript";
import fetch from 'node-fetch'
import * as mssql from 'mssql'

(async () => {

  const getMaskData = async () => {


    const fetchData = await fetch(`https://quality.data.gov.tw/dq_download_json.php?nid=116285&md5_url=2150b333756e64325bdbc4a5fd45fad1`


    ).then(res => res.json());
    return fetchData;
  }
  //  const jsonBuffer=await fs.promises.readFile('./data.json');
  const dd = await getMaskData();//JSON.parse(jsonBuffer.toString())
  const newdd = dd.map((b: any) => {
    return {
      id: Guid.create().toJSON()['value'],
      code: b['醫事機構代碼'],
      name: b['醫事機構名稱'],
      address: b['醫事機構地址'],
      phone: b['醫事機構電話'],
      humanCount: b['成人口罩剩餘數'],
      childCount: b['兒童口罩剩餘數'],
      sourceUpdateTime: b['來源資料時間'],
    }
  });
  await fs.promises.writeFile('./data2.json', Buffer.from(JSON.stringify(newdd))) 

  let sql: string = ''
  newdd.map((n: any) => {

    sql += `INSERT INTO [dbo].[MaskData]
            ([id]
            ,[code]
            ,[name]
            ,[address]
            ,[phone]
            ,[humanCount]
            ,[childCount]
            ,[sourceUpdateTime])
            VALUES
            (N'${n['id']}',
            N'${n['code']}',
            N'${n['name']}',
            N'${n['address']}',
            N'${n['phone']}',
            ${n['humanCount']},
          ${n['childCount']},
          N'${n['sourceUpdateTime']}'
            )
            
            
            `;

  });
  await fs.promises.writeFile('./data2.sql', Buffer.from(sql)) 

  

})()
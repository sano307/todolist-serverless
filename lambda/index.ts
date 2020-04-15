export const handler = async (event: any = {}) : Promise <any> => {
  console.log(event);

  return { statusCode: 200, body: 'Hello world!' };
};

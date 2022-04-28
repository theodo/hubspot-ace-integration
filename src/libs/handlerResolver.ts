export const handlerPath = (context: string) => {
  const relativePath = context.split(process.cwd())[1];

  if (!relativePath) throw new Error();

  return relativePath.substring(1).replace(/\\/g, "/");
};

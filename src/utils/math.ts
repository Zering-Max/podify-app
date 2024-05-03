export interface CalculateUploadProgressOptions {
  inputValue: number;
  outputMin: number;
  outputMax: number;
  inputMax: number;
  inputMin: number;
}

export function calculateUploadProgress(
  options: CalculateUploadProgressOptions,
) {
  const {inputValue, outputMax, outputMin, inputMax, inputMin} = options;

  const result =
    ((inputValue - inputMin) / (inputMax - inputMin)) *
      (outputMax - outputMin) +
    outputMin;

  if (result === Infinity) return 0;

  return result;
}

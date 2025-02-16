interface CandleStickOptions {
  chart: {
    type: string;
  };
  title: {
    text: string;
    align: 'left' | 'center' | 'right';
  };
  xaxis: {
    type: string;
  };
  yaxis: {
    tooltip: {
      enabled: boolean;
    };
  };
}

export const candleStickOptions: CandleStickOptions = {
  chart: {
    type: "candlestick",
  },
  title: {
    text: "CandleStick Chart",
    align: "left",
  },
  xaxis: {
    type: "datetime",
  },
  yaxis: {
    tooltip: {
      enabled: true,
    },
  },
}; 
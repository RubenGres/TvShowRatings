const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
  
  for(var i =0; i<10; i++) {
      var res = redYellowGreen(0,100,i*10);
      console.log(rgbToHex(res.red,res.green,res.blue));
  }
  
  function redYellowGreen(min, max, value)
  {
      var green_max = 220;
      var red_max = 220;
      var red = 0;
      var green = 0;
      var blue = 0;
  
      if (value < max/2)
      {
          red = red_max;
          green = Math.round((value/(max/2))*green_max);
      }
      else
      {
          green = green_max;
          red = Math.round((1-((value-(max/2))/(max/2)))*red_max);
      }
  
      var to_return = new Object();
      to_return.red = red;
      to_return.green = green;
      to_return.blue = blue;
  
      return to_return;
  }
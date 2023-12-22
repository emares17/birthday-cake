document.addEventListener('DOMContentLoaded', function () {
    // Get the cake element
    const cake = document.querySelector('.icing');

    // Get the candle template
    const candleTemplate = document.querySelector('.candle');

    // Candles array 
    const createdCandles = [];

    // Push the original candle to the array before creating new candles
    createdCandles.push(candleTemplate);

    // Add a click event listener to the cake
    cake.addEventListener('click', (event) => {
        const rect = cake.getBoundingClientRect()
        const x = event.clientX - rect.left;
        const y  = event.clientY - (rect.top + 45);

        // Clone the candle template
        const newCandle = candleTemplate.cloneNode(true);

        // Remove the "display: none" style to make it visible
        newCandle.style.display = 'block';

        newCandle.style.position = 'absolute';
        newCandle.style.left = x + 'px';
        newCandle.style.top = y + 'px';

        // Append the new candle to the cake
        cake.appendChild(newCandle);

        createdCandles.push(newCandle);
    });

    navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      // Create an audio context
      const audioContext = new AudioContext();
      // Create an audio source from the microphone
      const microphone = audioContext.createMediaStreamSource(stream);
      // Create an analyser node
      const analyser = audioContext.createAnalyser();
      const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

      // connect microphone to analyzer
      microphone.connect(analyser);
      analyser.connect(scriptProcessor);
      scriptProcessor.connect(audioContext.destination);

      // Set sound threshold 
      const threshold = 70;

      scriptProcessor.addEventListener('audioprocess', () => {
          const array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array)

          let sum = 0;
          for (let i = 0; i < array.length; i++) {
              sum += array[i];
          }

          let average = sum / array.length;

          if (average > threshold) {
              console.log('Sound Detected')
              for (let i = 0; i < createdCandles.length; i++) {  
                  const randomCandle = Math.floor(Math.random() * createdCandles.length);
                  const currentCandle = createdCandles[randomCandle];
                  const flameDiv = currentCandle.querySelector('.flame')

                  flameDiv.style.display = 'none';
              }
          }
      });
    // Not sure if its needed yet, upon first try it seemed needed but unsure atm.
      audioContext.resume();
    })
    .catch((error) => {
      console.error('Error accessing microphone:', error);
    });
    
});

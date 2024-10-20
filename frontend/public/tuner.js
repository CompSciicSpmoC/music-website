class PitchDetector {
  //Creates a new instantiation of the class
  constructor() {
    //Creates an environment used for managing and playing audio
    //'webkit' is used for older browsers
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    //Creates an analyser node used to extract data from audio
    this.analyser = this.audioContext.createAnalyser();
    //An array that will be used to store audio data
    this.dataArray = null;
    this.note = null
  }

  //Function used to capture user audio
  startCapture() {
    //Request access to the users microphone
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      //The variable 'stream' reprosents the audio captured from the users device and is passed using then as an argument
      .then((stream) => {
        //The constant 'source' is initialised to create a source node with relation to 'stream' that allows for the connection of other audio nodes
        const source = this.audioContext.createMediaStreamSource(stream);
        //Here the stream is connected to an analyser node that obtains real time frequency and time-domain data
        source.connect(this.analyser);
        //An fftSize is set to define how many samples the analyser will perform at a time
        this.analyser.fftSize = 2048;
        //An array named 'dataArray' is created to store the time-domain data
        this.dataArray = new Float32Array(this.analyser.fftSize);
        //Sets the variable 'audioCaptured' to true when audio is being captured
        document.getElementById("audioInput").textContent = `Audio Capture: ${this.audioCaptured}`;
        //Calls the processAudio function
        this.processAudio();
      })

      //Handle errors/callbacks and outputs relevant information to the user
      .catch((error) => {
        alert("Couldn't access microphone: " + error);
        console.log(error);
      });
  }

  //Function used to process the audio stream
  processAudio() {
      //Copies waveform data into 'dataArray' that will be used to calculate the note
      this.analyser.getFloatTimeDomainData(this.dataArray);
      //Results from processing is stored in the variable 'freq' that will be used to compare against note frequency values
      let fundamentalFreq = this.autoCorrelate();
      //If a valid frequency is detected then the HTML element with id 'noteOutput' will output the current value of 'this.note'
      if (fundamentalFreq !== -1) {
        document.getElementById("noteOutput").textContent = `Closest Note: ${this.note}`;
      }
      //Continuously calls the processAudio function using requestAnimationFrame 
      requestAnimationFrame(this.processAudio.bind(this));
    }
  }

  //Function that will be used to calculate an accurate pitch
  autoCorrelate() {
    let SIZE = this.dataArray.length;
    let maxSamples = Math.floor(SIZE / 2);
    let bestOffset = -1;
    let bestCorrelation = 0
    let rms = 0 

    for (let i = 0; i < SIZE; i++) {
      rms += this.dataArray[i] * this.dataArray[i];
    }

    rms = Math.sqrt(rms / SIZE);  

    if (rms < 0.01) return -1;

    let lastCorrelation = 1;

    for (let offset = 0; offset < maxSamples; offset++) {
      let correlation = 0;

      for (let i = 0; i < maxSamples; i++) {
        correlation += Math.abs((this.dataArray[i]) - (this.dataArray[i + offset]));
      }

      correlation = 1 - (correlation / maxSamples);
      if (correlation > 0.9 && correlation > lastCorrelation) {
        bestCorrelation = correlation;
        bestOffset = offset;
      }

      lastCorrelation = correlation;
    }

    if (bestCorrelation > 0.01) {
      let fundamentalFreq = this.audioContext.sampleRate / bestOffset;
      this.note = this.getNoteFromFrequency(fundamentalFreq);
      return fundamentalFreq;
    }

    return -1;
  }

  getNoteFromFrequency(frequency) {
    const note = [
      { note: "C0", freq: 16.35 },
      { note: "C#0/D♭0", freq: 17.32 },
      { note: "D0", freq: 18.35 },
      { note: "D#0/E♭0", freq: 19.35 },
      { note: "E0", freq: 20.60 },
      { note: "F0", freq: 21.83 },
      { note: "F#0/G♭0", freq: 23.12 },
      { note: "G0", freq: 24.50 },
      { note: "G#0/A♭0", freq: 25.56 },
      { note: "A0", freq: 27.50 },
      { note: "A#0/B♭0", freq: 29.14 },
      { note: "B0", freq: 30.87 },
      { note: "C1", freq: 32.70 },
      { note: "C#1/D♭1", freq: 34.65 },
      { note: "D1", freq: 36.71 },
      { note: "D#1/E♭1", freq: 38.89 },
      { note: "E1", freq: 41.20 },
      { note: "F1", freq: 43.65 },
      { note: "F#1/G♭1", freq: 46.25 },
      { note: "G1", freq: 49.00 },
      { note: "G#1/A♭1", freq: 51.91 },
      { note: "A1", freq: 55.00 },
      { note: "A#1/B♭1", freq: 58.27 },
      { note: "B1", freq: 61.74 },
      { note: "C2", freq: 65.41 },
      { note: "C#2/D♭2", freq: 69.30 },
      { note: "D2", freq: 73.42 },
      { note: "D#2/E♭2", freq: 77.78 },
      { note: "E2", freq: 82.41 },
      { note: "F2", freq: 87.31 },
      { note: "F#2/G♭2", freq: 92.50 },
      { note: "G2", freq: 98.00 },
      { note: "G#2/A♭2", freq: 103.83 },
      { note: "A2", freq: 110.00 },
      { note: "A#2/B♭2", freq: 116.54 },
      { note: "B2", freq: 123.47 },
      { note: "C3", freq: 130.81 },
      { note: "C#3/D♭3", freq: 138.59 },
      { note: "D3", freq: 146.83 },
      { note: "D#3/E♭3", freq: 155.56 },
      { note: "E3", freq: 164.81 },
      { note: "F3", freq: 174.61 },
      { note: "F#3/G♭3", freq: 185.00 },
      { note: "G3", freq: 196.00 },
      { note: "G#3/A♭3", freq: 207.65 },
      { note: "A3", freq: 220.00 },
      { note: "A#3/B♭3", freq: 233.08 },
      { note: "B3", freq: 246.94 },
      { note: "C4", freq: 261.63 },
      { note: "C#4/D♭4", freq: 277.18 },
      { note: "D4", freq: 293.66 },
      { note: "D#4/E♭4", freq: 311.13 },
      { note: "E4", freq: 329.63 },
      { note: "F4", freq: 349.23 },
      { note: "F#4/G♭4", freq: 369.99 },
      { note: "G4", freq: 392.00 },
      { note: "G#4/A♭4", freq: 415.30 },
      { note: "A4", freq: 440.00 },
      { note: "A#4/B♭4", freq: 466.16 },
      { note: "B4", freq: 493.88 },
      { note: "C5", freq: 523.25 },
      { note: "C#5/D♭5", freq: 554.37 },
      { note: "D5", freq: 587.33 },
      { note: "D#5/E♭5", freq: 622.25 },
      { note: "E5", freq: 659.25 },
      { note: "F5", freq: 698.46 },
      { note: "F#5/G♭5", freq: 739.99 },
      { note: "G5", freq: 783.99 },
      { note: "G#5/A♭5", freq: 830.61 },
      { note: "A5", freq: 880.00 },
      { note: "A#5/B♭5", freq: 932.33 },
      { note: "B5", freq: 987.77 },
      { note: "C6", freq: 1046.50 },
      { note: "C#6/D♭6", freq: 1108.73 },
      { note: "D6", freq: 1174.66 },
      { note: "D#6/E♭6", freq: 1244.51 },
      { note: "E6", freq: 1318.51 },
      { note: "F6", freq: 1396.91 },
      { note: "F#6/G♭6", freq: 1479.98 },
      { note: "G6", freq: 1567.98 },
      { note: "G#6/A♭6", freq: 1661.22 },
      { note: "A6", freq: 1760.00 },
      { note: "A#6/B♭6", freq: 1864.66 },
      { note: "B6", freq: 1875.53 },
      { note: "C7", freq: 2093.00 },
      { note: "C#7/D♭7", freq: 2217.46 },
      { note: "D7", freq: 2349.32 },
      { note: "D#7/E♭7", freq: 2489.02 },
      { note: "E7", freq: 2637.02 },
      { note: "F7", freq: 2793.83 },
      { note: "F#7/G♭7", freq: 2959.96 },
      { note: "G7", freq: 3135.96 },
      { note: "G#7/A♭7", freq: 3322.44 },
      { note: "A7", freq: 3520.00 },
      { note: "A#7/B♭7", freq: 3729.31 },
      { note: "B7", freq: 3951.07 },
      { note: "C8", freq: 4186.01 },
      { note: "C#8/D♭8", freq: 4434.92 },
      { note: "D8", freq: 4698.63 },
      { note: "D#8/E♭8", freq: 4978.03 },
      { note: "E8", freq: 5274.04 },
      { note: "F8", freq: 5587.65 },
      { note: "F#8/G♭8", freq: 5919.91 },
      { note: "G8", freq: 6271.93 },
      { note: "G#8/A♭8", freq: 6644.88 },
      { note: "A8", freq: 7040.00 },
      { note: "A#8/B♭8", freq: 7458.62 },
      { note: "B8", freq: 7902.13 },
    ];

    let closestNote = note.reduce((prev, curr) => {
      return (Math.abs(curr.freq - frequency) < Math.abs(prev.freq - frequency) ? curr : prev);
    });

    return closestNote.note;
  }

}

//Creates an instantiation of the class
const pitchDetector = new PitchDetector();

//Event listener is used to detect when the button is activated and when activated begins the program
document.getElementById("btn").addEventListener("click", () => {
  pitchDetector.startCapture();
});
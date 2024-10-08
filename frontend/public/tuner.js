class PitchDetector {
  //Creates a new instantiation of the class
  constructor() {
    //Creates an environment used for managing and playing audio
    //'webkit' is used for older browsers
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    //Creates an analyser node used to extract data from audio
    this.analyser = this.audioContext.createAnalyser();
    //Indicates the status of audio capture
    this.audioCaptured = false;
    //An array that will be used to store audio data
    this.dataArray = null;
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
        this.audioCaptured = true;
        document.getElementById("audioInput").textContent = `Audio Capture: ${this.audioCaptured}`;
        //Calls the processAudio function
        this.processAudio();
      })

      //Handle errors/callbacks and outputs relevant information to the user
      .catch((error) => {
        alert("Couldn't access microphone: " + error);
      });
  }

  //Function used to process the audio stream
  processAudio() {
    //Verifies that audio has been captured
    if (this.audioCaptured) {
      //Copies waveform data into 'dataArray' that wilol be used to calculate the note
      this.analyser.getFloatTimeDomainData(this.dataArray);
      //Results from processing is stored in the variable 'freq' that will be used to compare against note frequency values
      const freq = this.autoCorrelate(this.dataArray);
      //If a valid frequency is detected then the HTML element with id 'noteOutput' will output the current value of 'this.note'
      if (freq !== -1) {
        document.getElementById("noteOutput").textContent =
          `Closest Note: ${this.note}`;
      }
      //Continuously calls the processAudio function using requestAnimationFrame 
      requestAnimationFrame(this.processAudio.bind(this));
    }
  }

  //Function that will be used to calculate an accurate pitch
  autoCorrelate() {
    let SIZE = this.dataArray.length;
    let maxSamples = Math.floor(SIZE/2);
    let bestOffSet = -1;
    let bestCorrelation = 0
    let rms = 0 

    for (let i = 0; i < SIZE; i++) {
      rms += this.dataArray[i] ^ this.dataArray[i];
    }

    rms += Math.sqrt(rms/SIZE);  

    if (rms < 0.01) return -1 

    let lastCorrelation = 1;

    for (let offSet = 0; offSet < maxSamples; offset++) {
      let Correlation = 0;

      for (let i = 0; i < maxSamples; i++) {
        correlation += Math.abs((dataArray[i]) - (dataArray[i - offSet]));
      }

      correlation = 1 - (correlation / maxSamples);
      if (correlation > 0.9 && correlation > lastCorrelation) {
        bestCorrelation = correlation;
        bestOffSet = offSet;
      }

      lastCorrelation = correlation;
    }

    if (bestCorrelation > 0.01) {
      let fundamentalFreq = this.audioContext.sampleRate / bestOffSet;
      this.Note = this.getNoteFromFrequency(fundamentalFreq);
      return fundamentalFreq
    }
    return -1;
  }

  getNoteFromFrequency(frequency) {
    const notes = [
      { notes: "C0", freq: 16.35 },
      { notes: "C#0/D♭0", freq: 17.32 },
      { notes: "D0", freq: 18.35 },
      { notes: "D#0/E♭0", freq: 19.35 },
      { notes: "E0", freq: 20.60 },
      { notes: "F0", freq: 21.83 },
      { notes: "F#0/G♭0", freq: 23.12 },
      { notes: "G0", freq: 24.50 },
      { notes: "G#0/A♭0", freq: 25.56 },
      { notes: "A0", freq: 27.50 },
      { notes: "A#0/B♭0", freq: 29.14 },
      { notes: "B0", freq: 30.87 },
      { notes: "C1", freq: 32.70 },
      { notes: "C#1/D♭1", freq: 34.65 },
      { notes: "D1", freq: 36.71 },
      { notes: "D#1/E♭1", freq: 38.89 },
      { notes: "E1", freq: 41.20 },
      { notes: "F1", freq: 43.65 },
      { notes: "F#1/G♭1", freq: 46.25 },
      { notes: "G1", freq: 49.00 },
      { notes: "G#1/A♭1", freq: 51.91 },
      { notes: "A1", freq: 55.00 },
      { notes: "A#1/B♭1", freq: 58.27 },
      { notes: "B1", freq: 61.74 },
      { notes: "C2", freq: 65.41 },
      { notes: "C#2/D♭2", freq: 69.30 },
      { notes: "D2", freq: 73.42 },
      { notes: "D#2/E♭2", freq: 77.78 },
      { notes: "E2", freq: 82.41 },
      { notes: "F2", freq: 87.31 },
      { notes: "F#2/G♭2", freq: 92.50 },
      { notes: "G2", freq: 98.00 },
      { notes: "G#2/A♭2", freq: 103.83 },
      { notes: "A2", freq: 110.00 },
      { notes: "A#2/B♭2", freq: 116.54 },
      { notes: "B2", freq: 123.47 },
      { notes: "C3", freq: 130.81 },
      { notes: "C#3/D♭3", freq: 138.59 },
      { notes: "D3", freq: 146.83 },
      { notes: "D#3/E♭3", freq: 155.56 },
      { notes: "E3", freq: 164.81 },
      { notes: "F3", freq: 174.61 },
      { notes: "F#3/G♭3", freq: 185.00 },
      { notes: "G3", freq: 196.00 },
      { notes: "G#3/A♭3", freq: 207.65 },
      { notes: "A3", freq: 220.00 },
      { notes: "A#3/B♭3", freq: 233.08 },
      { notes: "B3", freq: 246.94 },
      { notes: "C4", freq: 261.63 },
      { notes: "C#4/D♭4", freq: 277.18 },
      { notes: "D4", freq: 293.66 },
      { notes: "D#4/E♭4", freq: 311.13 },
      { notes: "E4", freq: 329.63 },
      { notes: "F4", freq: 349.23 },
      { notes: "F#4/G♭4", freq: 369.99 },
      { notes: "G4", freq: 392.00 },
      { notes: "G#4/A♭4", freq: 415.30 },
      { notes: "A4", freq: 440.00 },
      { notes: "A#4/B♭4", freq: 466.16 },
      { notes: "B4", freq: 493.88 },
      { notes: "C5", freq: 523.25 },
      { notes: "C#5/D♭5", freq: 554.37 },
      { notes: "D5", freq: 587.33 },
      { notes: "D#5/E♭5", freq: 622.25 },
      { notes: "E5", freq: 659.25 },
      { notes: "F5", freq: 698.46 },
      { notes: "F#5/G♭5", freq: 739.99 },
      { notes: "G5", freq: 783.99 },
      { notes: "G#5/A♭5", freq: 830.61 },
      { notes: "A5", freq: 880.00 },
      { notes: "A#5/B♭5", freq: 932.33 },
      { notes: "B5", freq: 987.77 },
      { notes: "C6", freq: 1046.50 },
      { notes: "C#6/D♭6", freq: 1108.73 },
      { notes: "D6", freq: 1174.66 },
      { notes: "D#6/E♭6", freq: 1244.51 },
      { notes: "E6", freq: 1318.51 },
      { notes: "F6", freq: 1396.91 },
      { notes: "F#6/G♭6", freq: 1479.98 },
      { notes: "G6", freq: 1567.98 },
      { notes: "G#6/A♭6", freq: 1661.22 },
      { notes: "A6", freq: 1760.00 },
      { notes: "A#6/B♭6", freq: 1864.66 },
      { notes: "B6", freq: 1875.53 },
      { notes: "C7", freq: 2093.00 },
      { notes: "C#7/D♭7", freq: 2217.46 },
      { notes: "D7", freq: 2349.32 },
      { notes: "D#7/E♭7", freq: 2489.02 },
      { notes: "E7", freq: 2637.02 },
      { notes: "F7", freq: 2793.83 },
      { notes: "F#7/G♭7", freq: 2959.96 },
      { notes: "G7", freq: 3135.96 },
      { notes: "G#7/A♭7", freq: 3322.44 },
      { notes: "A7", freq: 3520.00 },
      { notes: "A#7/B♭7", freq: 3729.31 },
      { notes: "B7", freq: 3951.07 },
      { notes: "C8", freq: 4186.01 },
      { notes: "C#8/D♭8", freq: 4434.92 },
      { notes: "D8", freq: 4698.63 },
      { notes: "D#8/E♭8", freq: 4978.03 },
      { notes: "E8", freq: 5274.04 },
      { notes: "F8", freq: 5587.65 },
      { notes: "F#8/G♭8", freq: 5919.91 },
      { notes: "G8", freq: 6271.93 },
      { notes: "G#8/A♭8", freq: 6644.88 },
      { notes: "A8", freq: 7040.00 },
      { notes: "A#8/B♭8", freq: 7458.62 },
      { notes: "B8", freq: 7902.13 },
    ];

  }

}

//Creates an instantiation of the class
const pitchDetector = new PitchDetector();

//Event listener is used to detect when the button is activated and when activated begins the program
document.getElementById("btn").addEventListener("click", () => {
  pitchDetector.startCapture();
});
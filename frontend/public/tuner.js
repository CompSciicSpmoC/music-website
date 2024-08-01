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
  autoCorrelate(buffer) {
    this.note = "Test"
  }
}

//Creates an instantiation of the class
const pitchDetector = new PitchDetector();

//Event listener is used to detect when the button is activated and when activated begins the program
document.getElementById("Tuner").addEventListener("click", () => {
  pitchDetector.startCapture();
});
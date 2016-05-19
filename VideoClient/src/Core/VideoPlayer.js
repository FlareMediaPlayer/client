/**
 * class for handling the canvas element
 * @author Fredrik Sigvartsen and Brian Parra and Jens Omfjord and Ankit Kapoor
 * @memberOf Flare
 * @class Flare.VideoPlayer
 * @constructor
 * @param {Flare.MediaPlayer} mediaPlayer a reference to the mediaPlayer
 * @return {Flare.VideoPlayer} returns a Flare VideoPlayer
 */
Flare.VideoPlayer = function (mediaPlayer) {


    /**
     * @property {Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
     */
    this.mediaPlayer = mediaPlayer;

    /**
     * @property {object} canvas reference to the canvas object
     */
    this.canvas = null;

    /**
     * @property {number} videoWidth the video width
     */
    this.videoWidth;

    /**
     * @property {number} videoHeight the video height
     */
    this.videoHeight;

    /**
     * @property {object} videoPlayer the DOM video player container element
     */
    this.videoPlayer;

    /**
     * @property {object} controlBar the wrapper for the bottom control bar
     */
    this.controlBar;

    /**
     * @property {object} progressBarContainer the container for the progress bars
     */
    this.progressBarContainer;

    /**
     * @property {object} playButton the play button
     */
    this.playButton;

    /**
     * @property {object} controlBarInner the inner wrapper for the control bar
     */
    this.controlBarInner;

    /**
     * @property {object} leftControls a left floated div for the controls on the left of the bar
     */
    this.leftControls;

    /**
     * @property {object} rightControls a left floated div for the controls on the right of the bar
     */
    this.rightControls;

    /**
     * @property {object} settingsButton the settings button
     */
    this.settingsButton;

    /**
     * @property {string} settingsPath the svg path for the settings button
     */
    this.settingsPath;

    /**
     * @property {object} progressBar the bar that shows the timeline progress
     */
    this.progressBar;

    /**
     * @property {object} progressBarDisplayGroup wrapper for the different progress bars like buffering and playback
     */
    this.progressBarDisplayGroup;

    /**
     * @property {object} loadProgressBar shows buffer status
     */
    this.loadProgressBar;

    /**
     * @property {object} playProgress shows play progress in %
     */
    this.playProgress;

    /**
     * @property {object} timeDisplay shows formated time display
     */
    this.timeDisplay;

    /**
     * @property {object} volumeControl wrapper for volume slider
     */
    this.volumeControl;

    /**
     * @property {object} muteButton mute button
     */
    this.muteButton;

    /**
     * @property {object} loadingBar shows spinning wheel
     */
    this.loadingBar;

    /**
     * @property {boolean} buttonsLocked are the buttons currently locked
     */
    this.buttonsLocked = false;

    /**
     * @property {number} durationInMin the duration in min
     */
    this.durationInMin = 0;

    /**
     * @property {number} fps the frames per second
     */
    this.fps;

    this.muteButtonStyle = {
        background: 'none',
        border: 'none',
        color: 'white'
    };

    this.volumeControlStyle = {
        display: 'inline-block'

    };

    this.loadProgressBarStyle = {
        position: 'absolute',
        bottom: 0,
        left: '0px',
        'background-color': 'rgba(255,255,255,0.4)',
        height: '100%',
        width: '100%',
        'transform-origin': '0 0 '
    };

    this.timeDisplayStyle = {
        display: 'inline-block',
        padding: '0 5px',
        'line-height': '30px',
        color: 'rgba(255,255,255,0.95)',
        'font-family': 'Verdana, Geneva, sans-serif',
        'font-size': '12px'
    };

    this.playProgressStyle = {
        'z-index': 2,
        position: 'absolute',
        bottom: 0,
        left: '0px',
        'background-color': 'rgba(0,0,255,0.4)',
        height: '100%',
        width: '100%',
        'transform-origin': '0 0 '
    };

    this.progressBarDisplayGroupStyle = {
        height: '100%',
        //transform: 'scaleY(0.5)',
        transition: 'transform .1s cubic-bezier(0.4,0.0,1,1)',
        'background-color': 'rgba(255,255,255,0.3)',
        'transform-origin': 'bottom'


    };

    this.progressBarStyle = {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100%',
        'touch-action': 'none'

    };

    this.progressBarAttribtues = {
        role: 'slider',
        draggable: 'true',
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'aria-valuenow': 0,
        //'tabindex' : 0

    };

    this.rightControlsStyle = {
        float: 'right',
        height: '100%'
    };



    this.leftControlsStyle = {
        float: 'left',
        height: '100%'
    };

    this.videoPlayerStyle = {
        position: 'relative',
        overflow: 'hidden',
        width: '960px',
        height: '540px',
        display: 'inline-block',
        'font-family': 'Arial'

    };

    this.controlBarInnerStyle = {
    };

    this.controlBarStyle = {
        height: '30px',
        position: 'absolute',
        bottom: '0',
        left: 0,
        right: 0,
        'background-color': 'rgba(0,0,0,0.5)'
    };

    this.playButtonStyle = {
        color: 'white',
        'font-size': '20px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        width: '30px'

    };

    this.progressBarContainerStyle = {
        width: '100%',
        position: 'absolute',
        height: '5px',
        bottom: '30px',
        cursor: 'pointer'
    };

    this.loadingBarStyle = {
        position: 'absolute',
        left: '40%',
        top: '30%',
        right: '0px',
        bottom: '0px',
        width: '100%',
        height: '100%',
        'z-index': '99',
        background: "url('../src/images/page-loader.gif')",
        'background-repeat': 'no-repeat'
    };

    return this;



};

Flare.VideoPlayer.prototype = {
    /**
     * Boots up the VideoPlayer and creates the Dom Elements
     * @memberof Flare.VideoPlayer.prototype
     * @function boot
     */
    boot: function () {

        this.videoPlayer = document.createElement("div");
        this.loadingBar = document.createElement("div");
        this.controlBar = document.createElement("div");
        this.progressBarContainer = document.createElement("div");
        this.leftControls = document.createElement("div");
        this.rightControls = document.createElement("div");
        this.controlBarInner = document.createElement("div");
        this.playButton = document.createElement("button");
        this.muteButton = document.createElement("button");
        this.volumeControl = document.createElement("div");
        this.progressBar = document.createElement("div");
        this.loadProgressBar = document.createElement("div");
        this.progressBarDisplayGroup = document.createElement("div");
        this.controlBarInner = document.createElement("div");
        this.playProgress = document.createElement("div");
        this.timeDisplay = document.createElement("div");
        this.settingsButton = document.createElement("svg");
        this.settingsPath = document.createElementNS('http://www.w3.org/2000/svg', "path");



        this.settingsPath.setAttributeNS(null, "d", Flare.Icons.settings);
        this.videoPlayer.id = "videoId";

        this.playButton.innerHTML = "&#9658;";
        this.muteButton.innerHTML = "&#9732;";


        this.canvas = new Flare.Canvas(this);


        this.setStyle(this.videoPlayer, this.videoPlayerStyle);
        this.setStyle(this.controlBar, this.controlBarStyle);
        this.setStyle(this.playButton, this.playButtonStyle);
        this.setStyle(this.progressBarContainer, this.progressBarContainerStyle);
        this.setStyle(this.leftControls, this.leftControlsStyle);
        this.setStyle(this.rightControls, this.rightControlsStyle);
        this.setStyle(this.progressBar, this.progressBarStyle);
        this.setStyle(this.progressBarDisplayGroup, this.progressBarDisplayGroupStyle);
        this.setStyle(this.playProgress, this.playProgressStyle);
        this.setStyle(this.timeDisplay, this.timeDisplayStyle);
        this.setStyle(this.volumeControl, this.volumeControlStyle);
        this.setStyle(this.muteButton, this.muteButtonStyle);
        this.setStyle(this.loadingBar, this.loadingBarStyle);
        this.setStyle(this.loadProgressBar, this.loadProgressBarStyle);


        this.setAttributes(this.progressBar, this.progressBarAttribtues);

        this.settingsButton.appendChild(this.settingsPath);
        this.videoPlayer.appendChild(this.canvas.getCanvas());
        this.controlBarInner.appendChild(this.leftControls);
        this.controlBarInner.appendChild(this.rightControls);
        //this.volumeControl.appendChild(this.muteButton);
        this.leftControls.appendChild(this.playButton);
        this.leftControls.appendChild(this.volumeControl);
        this.leftControls.appendChild(this.timeDisplay);
        this.rightControls.appendChild(this.settingsButton);
        this.progressBarContainer.appendChild(this.progressBar);
        this.progressBar.appendChild(this.progressBarDisplayGroup);
        this.progressBarDisplayGroup.appendChild(this.playProgress);
        this.progressBarDisplayGroup.appendChild(this.loadProgressBar);
        this.controlBar.appendChild(this.progressBarContainer);
        this.controlBar.appendChild(this.controlBarInner);

        //BIND HANDLERS
        this.progressBar.onmousedown = this.handleMouseDown.bind(this);
        this.progressBar.ondragstart = this.handleDragStart.bind(this);
        this.progressBar.ondrag = this.handleDrag.bind(this);
        this.progressBar.ondragend = this.handleDragEnd.bind(this);
        this.playButton.onclick = this.handlePlayButtonPress.bind(this);
        this.videoPlayer.ondblclick = this.playerFullScreen.bind(this);

        this.videoPlayer.appendChild(this.controlBar);
        this.videoPlayer.appendChild(this.loadingBar);
        if (!this.mediaPlayer.buffer.isLoaded) {
            this.toggleLockingButtons();
        }


        this.updatePlayProgress(0.0);
        this.updateLoadProgress(0.0);



        var target;
        var parent = this.mediaPlayer.options.container;


        if (parent) {
            if (typeof parent === 'string') {
                target = document.getElementById(parent);
            } else if (typeof parent === 'object' && parent.nodeType === 1) {
                target = parent;
            }
        }

        // Fallback, covers an invalid ID and a non HTMLelement object
        if (!target) {

            target = document.body;
        }
        console.log(target);
        target.appendChild(this.videoPlayer);
    },
    /**
     * On each update (hopefully 60fps) update the UI
     * @memberof Flare.VideoPlayer.prototype
     * @function update
     * @param {number} the current time of the video
     */
    update: function (videoTime) {
        //calculate which frame number, get that frame from buffer
        //video time is in ms
        var progress = (videoTime / 1000) / this.mediaPlayer.buffer.getDuration();

        if (progress >= 1.0) {
            this.mediaPlayer.finishPlayback();
            return;
        }

        var frameNumber = Math.floor((videoTime / 1000) * this.fps);
        //console.log(progress + "progress");
        //console.log (frameNumber + "frame num");
        this.canvas.render(this.mediaPlayer.buffer.getFrameAt(frameNumber));

        this.updatePlayProgress(progress);
        this.updateTimeDisplay(videoTime);

    },
    /**
     * Utility function for setting styles of an element
     * @memberof Flare.VideoPlayer.prototype
     * @function setStyle
     * @param {object} element Dom element to add styles to
     * @param {array} attributes attributes to add 
     */
    setStyle: function (element, attributes) {

        for (var attribute in attributes) {
            element.style.setProperty(attribute, attributes[attribute]);
        }


    },
    /**
     * Utility function for setting attributes of an element
     * @memberof Flare.VideoPlayer.prototype
     * @function setAttributes
     * @param {object} element Dom element to add attributes to
     * @param {array} attributes attributes to add 
     */
    setAttributes: function (element, attributes) {

        for (var attribute in attributes) {
            element.setAttribute(attribute, attributes[attribute]);
        }
    },
    /**
     * Updates the progress in the timeline display
     * @memberof Flare.VideoPlayer.prototype
     * @function updatePlayProgress
     * @param {number} progress the progress in %
     */
    updatePlayProgress: function (progress) {
        this.playProgress.style.setProperty("transform", "scaleX(" + progress + ")");
        this.progressBar.setAttribute("aria-valuenow", parseInt(progress * 100));
    },
    /**
     * Updates the progress in the buffering display
     * @memberof Flare.VideoPlayer.prototype
     * @function updateLoadProgress
     * @param {number} progress the progress in %
     */
    updateLoadProgress: function (progress) {
        this.loadProgressBar.style.setProperty("transform", "scaleX(" + progress + ")");
        //this.progressBar.setAttribute("aria-valuenow", parseInt(progress * 100));
    },
    /**
     * Bind callback for mouse down on timeline
     * @memberof Flare.VideoPlayer.prototype
     * @function handleMouseDown
     * @param {object} e the mouse event
     */
    handleMouseDown: function (e) {
        console.log(e);
        var currentProgress = parseInt(this.progressBar.getAttribute('aria-valuenow'));
        this.mediaPlayer.isPlaying = false;

        return false;
    },
    /**
     * Bind callback for mouse drag starts
     * @memberof Flare.VideoPlayer.prototype
     * @function handleDragStart
     * @param {object} e the mouse event
     */
    handleDragStart: function (e) {

        console.log(e);

    },
    /**
     * Bind callback for mouse drag. Use this for dragging the timeline and repositioning playback
     * @memberof Flare.VideoPlayer.prototype
     * @function handleDrag
     * @param {object} e the mouse event
     */
    handleDrag: function (e) {

        //Make new indicator to show the drag location

        //First get position of cursor depending on location

        //Calculate percentage

        //Now set the valuenow to the % progress
        console.log(e);

    },
    /**
     * Bind callback for mouse drag ends, start playing again if was previously playing
     * @memberof Flare.VideoPlayer.prototype
     * @function handleDragEnd
     * @param {object} e the mouse event
     */
    handleDragEnd: function (e) {

        //if in play mode, continue playing from new location
        //buffer if neccessary

    },
    /**
     * Bind callback for play button. Toggle playback here
     * @memberof Flare.VideoPlayer.prototype
     * @function handlePlayButtonPress
     * @param {object} e the mouse event
     */
    handlePlayButtonPress: function (e) {
        console.log("play clicked");
        this.mediaPlayer.togglePlay();

        if (this.mediaPlayer.isPlayMode()) {
            this.playButton.innerHTML = "||";
        } else {
            this.playButton.innerHTML = "&#x025B8;";
        }

    },
    /**
     * Bind callback for video player doubleclick. 
     * @function playerFullScreen to go into full screen mode.
     * @param {object} e the mouse event
     */
    playerFullScreen: function(e) {
		
		if (this.videoPlayer.requestFullscreen) {
		  this.videoPlayer.requestFullscreen();
		} else if (this.videoPlayer.msRequestFullscreen) {
		  this.videoPlayer.msRequestFullscreen();
		} else if (this.videoPlayer.mozRequestFullScreen) {
		  this.videoPlayer.mozRequestFullScreen();
		} else if (this.videoPlayer.webkitRequestFullscreen) {
		  this.videoPlayer.webkitRequestFullscreen();
		}
	
	},
    /**
     * Updates the numerical time display in formated min/sec
     * @memberof Flare.VideoPlayer.prototype
     * @function handlePlayButtonPress
     * @param {number} videoTime the time in the video
     */
    updateTimeDisplay: function (videoTime) {
        this.timeDisplay.innerHTML = this.formatTimeFromMiliSeconds(videoTime) + " / " + this.durationInMin;
    },
    /**
     * Utility function to format time in seconds into a string
     * @memberof Flare.VideoPlayer.prototype
     * @function formatTimeFromSeconds
     * @param {number} timeInSeconds video time in seconds
     * @return {string} formated time
     */
    formatTimeFromSeconds: function (timeInSeconds) {
        var totalSeconds = Math.floor(timeInSeconds);
        var min = Math.floor(totalSeconds / 60);
        var seconds = totalSeconds % 60;
        var formattedTime = this.formatDigits(min) + ":" + this.formatDigits(seconds);

        return formattedTime;
    },
    /**
     * Utility function to format time in ms into a string
     * @memberof Flare.VideoPlayer.prototype
     * @function formatTimeFromMiliSeconds
     * @param {number} timeInMS video time in ms
     * @return {string} formated time
     */
    formatTimeFromMiliSeconds: function (timeInMs) {
        return this.formatTimeFromSeconds(timeInMs / 1000);
    },
    /**
     * Utility function to format the leading 0
     * @memberof Flare.VideoPlayer.prototype
     * @function formatDigits
     * @param {number} time to format
     * @return {string} formated time with leading 0 if single digit
     */
    formatDigits: function (time) {
        if (time > 9)
            return time
        else
            return "0" + time;
    },
    /**
     * Removes loading animation once loaded
     * @memberof Flare.VideoPlayer.prototype
     * @function removeLoadingBar
     */
    removeLoadingBar: function () {
        this.videoPlayer.removeChild(this.loadingBar);
    },
    /**
     * Locks and unlocks the ui buttons
     * @memberof Flare.VideoPlayer.prototype
     * @function toggleLockingButtons
     */
    toggleLockingButtons: function () {
        if (this.buttonsLocked) {
            this.playButton.removeAttribute("disabled");
            this.muteButton.removeAttribute("disabled");
            this.volumeControl.removeAttribute("disabled");
            this.progressBar.removeAttribute("disabled");
            this.settingsButton.removeAttribute("disabled");

            this.buttonsLocked = false;
        } else { // lock buttons
            this.playButton.setAttribute("disabled", "disabled");
            this.muteButton.setAttribute("disabled", "disabled");
            this.volumeControl.setAttribute("disabled", "disabled");
            this.progressBar.setAttribute("disabled", "disabled");
            this.settingsButton.setAttribute("disabled", "disabled");
            this.buttonsLocked = true;
        }
    },
    /**
     * Sets the duration of the video 
     * @memberof Flare.VideoPlayer.prototype
     * @function setDuration
     * @param {number} duration duration in seconds
     */
    setDuration: function (duration) {
        console.log(this.formatTimeFromSeconds(duration) + "loading");
        this.durationInMin = this.formatTimeFromSeconds(duration);
        this.updateTimeDisplay(0);

    },
    /**
     * Sets the fps
     * @param {number} fps frames per second
     */
    setFps: function (fps) {
        this.fps = fps;
    },
};

Flare.VideoPlayer.prototype.constructor = Flare.VideoPlayer;

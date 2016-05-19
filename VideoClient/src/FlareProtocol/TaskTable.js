/**
 * Hash map of FlareTasks for corresponding Flare OpCodes
 * @author Brian Parra
 * @memberOf Flare
 * @type {object}
 * @constant
 */
Flare.TaskTable = {};
Flare.TaskTable[Flare.OpCode.OPEN_VIDEO] = Flare.InitializeVideoTask;
Flare.TaskTable[Flare.OpCode.FRAME] = Flare.ProcessFrameTask;
Flare.TaskTable[Flare.OpCode.AUDIO] = Flare.ProcessAudioTask;
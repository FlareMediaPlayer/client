Flare.TaskTable = {};
Flare.TaskTable[Flare.OpCode.OPEN_VIDEO] = Flare.InitializeVideoTask;
Flare.TaskTable[Flare.OpCode.FRAME] = Flare.ProcessFrameTask;
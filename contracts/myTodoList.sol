pragma solidity >=0.4.22 <0.9.0;

contract myTodoList {

    // Model a Task
    struct Task {
        uint id;
        string content;
        bool completed;
    }

    // Read/write Tasks
    mapping(uint => Task) public Tasks;
	
	// Store Tasks Count
    uint public TasksCount = 0;

    function addTask (string memory _content) public {
        TasksCount ++;
        Tasks[TasksCount] = Task(TasksCount, _content, false);

    }
    
    Task TaskTemp;
    string comparedContent;
    string contentClicked;
    bytes32 a;
    bytes32 b;

    function deductTask (string memory _contentClicked) public {

        uint i ;
        for(i = 1; i <= TasksCount; i++) {
             comparedContent = Tasks[i].content; 
             contentClicked = _contentClicked;

             //can not compare strings directly, need to hash them first 
             a = keccak256(abi.encodePacked(comparedContent));

             b = keccak256(abi.encodePacked(contentClicked));

             if(a == b){
                 delete Tasks[i].content;
              }
        }
  
    }

	
    constructor () public {
        addTask("my 1 task");
        addTask("my 2 task");
        addTask("my 3 task");
        addTask("my 4 task");
        addTask("my 5 task");
        addTask("my 6 task");
        addTask("my 7 task");
        addTask("my 8 task");
        addTask("my 9 task");
        addTask("my 10 task");
    }

}
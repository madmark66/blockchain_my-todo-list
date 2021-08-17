App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
  
    init: function() {
      return App.initWeb3();
    },
  
    initWeb3: function() {
      if (typeof web3 !== 'undefined') {
        // If a web3 instance is already provided by Meta Mask.
        App.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
      } else {
        // Specify default instance if no web3 instance provided
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        web3 = new Web3(App.web3Provider);
      }
      return App.initContract();
    },
  
    initContract: function() {
      $.getJSON("myTodoList.json", function(mytodoList) {
        // Instantiate a new truffle contract from the artifact
        App.contracts.myTodoList = TruffleContract(mytodoList);
        // Connect provider to interact with contract
        App.contracts.myTodoList.setProvider(App.web3Provider);
  
        //App.listenForEvents();
  
        return App.render();
      });
    },
  
    render: function() {
  
       //Load account data
       if(web3.currentProvider.enable){
       //For metamask
         web3.currentProvider.enable().then(function(acc){
            App.account = acc[0];
            $("#accountAddress").html("Your Account: " + App.account);
         });
       }
       else{
         App.account = web3.eth.accounts[0];
         $("#accountAddress").html("Your Account: " + App.account);
       }
    
       // Load contract data
        App.contracts.myTodoList.deployed().then(function(instance) {
          myTodoListInstance = instance;
          return myTodoListInstance.TasksCount();
        }).then(function(TasksCount){
          var shownList = document.getElementById("todo-list")
                  
          TasksCount = TasksCount.toNumber();

          for (var i = 1; i <= TasksCount; i++) {
            
              myTodoListInstance.Tasks(i).then(function(task) {
                  var id = task[0];
                  var content = task[1];
                  let completed = task[2];
                  
                  // create li node inside of for loop so that you won't appendChild the same 'li' over and over again 
                  var newTaskNode = document.createElement('li');

                  newTaskNode.innerHTML = content;
                  
                  // Add a "X" symbol in the end of each listed task
                  var span = document.createElement("SPAN");
                  var txt = document.createTextNode("x");
                  span.className = "close";
                  span.appendChild(txt);
                  newTaskNode.appendChild(span);                

                  // when content is deleted, don't show up the its <li>
                  if( content != '' ){
                    // Render initial tasks Result
                    shownList.appendChild(newTaskNode);
                  } 

                  // when click to X, list disappear
                  span.addEventListener( "click", function() {
                    var div = this.parentElement;
                    div.removeChild(span);
                    var xContent = div.textContent;              
                    return App.clickXtoKill(xContent);
                  });
              });            
          }

        });             
    },

    clickXtoKill: function(xContent){
             //Load account data
             if(web3.currentProvider.enable){
              //For metamask
                web3.currentProvider.enable().then(function(acc){
                   App.account = acc[0];
                   $("#accountAddress").html("Your Account: " + App.account);
               });
              }
              else{
                App.account = web3.eth.accounts[0];
                $("#accountAddress").html("Your Account: " + App.account);
              }
              
              
              // Load contract data
               App.contracts.myTodoList.deployed().then(function(instance) {
                 myTodoListInstance = instance;
                 return myTodoListInstance.deductTask(xContent, { from: App.account });
                }).then(function(result) {
                  //  to update
                  App.render();
                  window.location.reload();
                })


    },

    addTodo: function() {
          var myInput = document.getElementById("todo-input");

          var inputValue = $('#todo-input').val();

          //send back input value to contract's addTask function, then refresh page
          App.contracts.myTodoList.deployed().then(function(instance) {
            myTodoListInstance = instance;
          return myTodoListInstance.addTask(inputValue, { from: App.account });
          }).then(function(result) {
            //  to update
            App.render();
            window.location.reload();
          })
          // .catch(function(err) {
          //   console.error(err);
          // });
          myInput.value = "";
    }               
};

// Add a "checked" symbol when clicking on a list item
let list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
  }
}, false);
    
// initialize App object 
$(function() {
  $(window).load(function() {
    App.init();
  });
});

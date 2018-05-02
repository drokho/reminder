
var notifications = [];

//const applicationServerPublicKey = 'BOWTaeXFjnOyT8DXE6yR7NOnGJdbLNZEHJgmvjdRnygjK6xXEPxbMixfWUaMz9ACWuMfvc1SkrndJM9Qco1ufWE';

//const applicationServerPrivateKey = '_dhkQqXRD1cOQS-C9obhxi8rejNN6WXMHpL0XsTBTTE';

function notify(title, message) {
    navigator.serviceWorker.register('sw.js');
    Notification.requestPermission(function(result) {
      if (result === 'granted') {
        navigator.serviceWorker.ready.then(function(registration) {
          registration.showNotification(title, {
              'body': message,
              'icon' : 'icon-64.png',
              'vibrate': [200, 100, 200, 100, 200, 100, 400]
          });
        });
      }
    });
}



function insertTask(taskName, interval) {
    localStorage.setItem(taskName, interval);
    
    notify('Reminder Set for ' + interval + ' hours', taskName);
    
    var myNoty = setInterval(function() {
       notify('Reminder!', taskName);
    }, (interval * 60 * 60 * 1000));
    
    notifications.push({
            'task': taskName,
            'interval': myNoty
    });
    
}

function showTasks() {
    var output = '';

    for(var i = 0; i < localStorage.length; i++)
    {
        var task = localStorage.key(i);
        var interval = localStorage.getItem(task);
        var hours = '';


        if(interval > 1)
            hours = interval + ' hours';
        else hours = 'hour';

        output += '<li class="task-' + (i + 1) + '"><a class="action delete">-</a><p class="reminder-text">Remind me every ' + hours + ' to ' + task + '</p></li>';
    }

    $('.task-list').html(output);


}


function deleteTask(task) {

    var key = $(task).attr('class').replace('task-', '');
    key = key - 1;
    var taskName = localStorage.key(key);
    
    for (var i in notifications) {
        if(notifications[i].task == taskName) {
            clearInterval(notifications[i].interval);
        }
    }
    
    
    
    
    
    
    localStorage.removeItem(taskName);
    
    
    
    showTasks();
    
}


$(document).ready(function() {
    showTasks();

    $('#reminder-form').submit(function() {
        insertTask($('#task').val(), $('#interval').val());
        $('#task').val('');
        showTasks();

        return false;
    });

    $('.task-list').on('click', '.delete', function(e) {
        e.preventDefault();

        deleteTask(e.target.parentNode);
    });

    $('.task-list').on('click', '.edit', function(e) {
        e.preventDefault();

        editTask(e.target.parentNode);
    });
    
});
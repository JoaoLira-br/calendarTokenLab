$.ajax({
    url: '/projects/calendarTokenLab/server/proxy.php',
    type: 'POST',
    data: {action: 'fetch_id'},
    dataType: 'json'
})
    .then(function(response1) {
        // This function is called when the first request is successful.
        // 'response1' contains the data returned from the first request.

        console.log('First request successful:', response1);
        user_id = response1.user_id;

        // Returning another $.ajax call makes the next then wait for it to resolve
        return $.ajax({
            url: '/projects/calendarTokenLab/server/proxy.php',
            type: 'POST',
            data: {action: 'fetch_events', user_id: user_id},
            dataType: 'json'
        });
    })
    .then(function(response2) {
        console.log('Second request successful:', response2);

        // This function is called when the second request is successful.
        // 'response2' contains the data returned from the second request.
        calendar = response2.events;

    })
    .catch(function(error) {
        // This function is called if any of the requests fail.
        // 'error' contains the error information.

        console.error('Request failed:', error);
    });




//
// $.post('/projects/calendarTokenLab/server/proxy.php', {
//     action: 'fetch_events',
//     user_id: user_id
// }).done(function(data){
//     if(data.events){
//         calendar = data.events;
//         localStorage.setItem("calendar", JSON.stringify(calendar));
//     }else{
//         console.log("no events");
//     }
//
//   }).fail(function(jqXHR, textStatus, errorThrown){
//     console.error('Fetch Error:', errorThrown);
//   });
//   console.log("test");



$.post('/projects/calendarTokenLab/server/proxy.php', {action: 'fetch_id'}).done().fail()
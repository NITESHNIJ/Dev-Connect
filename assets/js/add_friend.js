{
    console.log('IN ADD FRIEND.JS');
    let button=$('.add-friend');
    button.on('click',(e)=>{
        console.log('ADD FRIEND BUTTON CLICKED',button.attr('id'));
        let id=button.attr('id');
        $.ajax({
            type:'get',
            url:`/friends/addfriend/${id}`,
            success:(data)=>{
                console.log(data);
                if(data.addedFriend)
                {
                    button.html('REMOVE FRIEND');
                    $('.add-friend').text('REMOVE FRIEND');
                    //button.innerHTML='REMOVE FRIEND';
                }
                else{
                    button.html('ADD FRIEND');
                    //$('.add-friend').text('REMOVE FRIEND');
                }
            },
            error:(err)=>{
                console.log('error');
            }
        })
    })
}
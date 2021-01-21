{
    let newpostdom = (post) => {
        return $(`<li id="post-${post._id}" style="margin:5">
        <div class="card" style="width: 18rem;">
            <img src="https://homepages.cae.wisc.edu/~ece533/images/airplane.png" class="card-img-top"
                alt="...">
            <div class="card-body">
                <h5 class="card-title">By ${post.user.name} </h5>
                <p class="card-text">${post.content} </p>
            </div>
            <div style=" display: flex; flex-direction: row; justify-content: space-evenly;padding-bottom:10;">
                <a href="/likes/toggle/?id=${post._id}&type=Post" class="card-link Like-bt"><i class="far fa-thumbs-up"></i></a>
                <i onclick="toggle(this.id)" style="font-size: medium;" id="${post._id}"
                    class="fas fa-comments"></i>
                 
                    <a id="delete-link" href="/posts/destroy/${post._id}"><i class="fas fa-trash"></i></a>
                
            </div>
            <div class="card-body" id='comment-form-${post._id}' style="display: none;">
                <form  id="C-form" action="/comments/create" method="POST">
                    <div class="form-group">
                        <label for="exampleInputEmail1">Add Comment</label>
                        <input type="text" required name="content" class="form-control" id="exampleInputEmail1"
                            aria-describedby="emailHelp" placeholder="Add Comment">
                    </div>
                    <input type="hidden" name="post" value="${post._id}">
                    <button type="submit"  id="comment-btn-1"  class="btn btn-primary btn-sm">Submit</button>
                </form>
                <div id="comments-container">
                    <ul style="list-style-type: none;">
                       
                    </ul>
                </div>
            </div>


        </div>
    </li>`)
    }
    let newcommentdom = (comment) => {
        return (`<li id="${comment._id}" class="m-3">
        <a class="comment-delete-link-${comment._id}" href="/comments/destroy/${comment._id}"><i class="fas fa-trash"></i></a>
        <h5 class="display-6">By ${comment.user.name}</h5>
        <p class="card-text">${comment.content}</p>
    </li>`)
    }
    let createpost = () => {
        let newpostform = $('#new-post-form');
        newpostform.submit((e) => {
            e.preventDefault();
            let data1=new FormData();
            let content=$('#exampleFormControlTextarea1').val();
            console.log(content);
            let file=$('#file')[0].files[0];
            data1.append('content',content);
            data1.append('post_img',file);
            $.ajax({
                type: 'post',
                processData: false,
                contentType: false,
                url: '/posts/create',
                data: data1,
                success: (data) => {
                    console.log('received success');
                    let post = data.data.post;
                    let dom = newpostdom(post);
                    deletePost($(' #delete-link', dom));
                    createComment($(' #C-form', dom));
                    console.log('wait');
                    $('#post-container>ul').prepend(dom);
                    //TODO:
                    console.log(data);
                },
                error: (err) => {
                    console.log(err);
                }
            })
        })
    }
    let deletePost = (deleteLink) => {
        $(deleteLink).click((e) => {
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: (data) => {
                    console.log('here-in delete');
                    $(`#post-${data.data.post_id}`).remove();
                },
                error: (error) => {
                    console.log('error', error.responseText);
                }
            })
        })
    }
    let createComment = (commentform) => {
        commentform.submit((e) => {
            e.preventDefault();
            $.ajax({
                type:'post',
                url: '/comments/create',
                data: commentform.serialize(),
                success: (data) => {
                    let comment=newcommentdom(data.data.comment);
                    $('#comments-container>ul').prepend(comment);
                    deleteComment(data.data.comment._id);
                    console.log(data);
                },
                error: (err) => {
                    console.log('err');
                }
            })
        })
    }
   
    let deleteComment=(comment)=>{
        $(document).on('click',`.comment-delete-link-${comment}`, (e) => {
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: `/comments/destroy/${comment}`,
                success: (data) => {
                    console.log('here-in delete');
                    $(`#${data.data.comment_id}`).remove();
                },
                error: (error) => {
                    console.log('error',error.responseText);
                }
            })
        });
       
    }
    let posts = $('#post-container>ul li');
    for (post of posts) {
        deletePost($(' #delete-link', post));
        createComment($(' #C-form', post));
        let postId=$(post).attr('id');
        let comments=$(`#${postId} #comments-container > ul li`);
        for(comment of comments)
        {
            deleteComment($(comment).attr('id'))
        }
    }
    let addlikeEvent=(like)=>{
        like.addEventListener('click',(e)=>{
            e.preventDefault();
            console.log('clicked',$(like).prop('href'));
            $.ajax({
                type:'get',
                url:like.href,
                success:function(data)
                 {
                     console.log('In ajax',data);
                     like.innerHTML=`<i class="far fa-thumbs-up">${data.data.length}</i>`;

                    // let count=document.getElementById("Like-count");
                    // count.value=data.likeable.likes.length;
                    // $(like).html();
                    
                 },
                 error:function(err)
                 {
                     console.log(`error:${err.responseText}`);
                 }

            })
        })
    }
    let likes=$('.Like-bt');
    for(like of likes)
    {
        console.log(like.href);
        addlikeEvent(like);
    }
    console.log(likes);
    createpost();
}


{
    // method to submit form data for posts using AJAX
    let createPost = () => {
        let newPostForm = $('#new-post-form');

        newPostForm.submit((e) => {
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: (data) => {
                    let newPost = newPostDOM(data.data.post);
                    $('#show-posts > ul').prepend(newPost);
                    deletePost($(' .delete-post-btn', newPost));

                    new Noty({
                        theme: 'relax',
                        text: 'Post Created',
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                },
                error: (err) => {
                    new Noty({
                        theme: 'relax',
                        text: 'Error',
                        type: 'error',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                }
            });
        });
    }

    // method to create a post in DOM
    let newPostDOM = (post) => {
        return $(`<li id="post-${post._id}">
                    <div class="post">
                        <p id="posts">${post.content}<p>
                        <span><small id="u_name-${post.user.name}">${post.user.name}</small></span>
                        <a class="delete-post-btn" href="/posts/delete?:${post._id}"><small>Delete Post</small></a>
                            
                    </div>
                    <div class="comment-form">
                        <form action="/comments/create" method="post" id="comment-post-form">
                            <input type="text" name="content" placeholder="Add Comment..." required />
                            <input type="hidden" name="post" value="${post._id}" />
                            <input type="submit" value="Comment" />
                        </form>
                    </div>
                    <div class="post-comment-lists">
                        <ul id="post-comment-${post._id}">
                            
                        </ul>
                    </div>

                </li>

            `)
    }


    let deletePost = (deleteLink) => {
        $(deleteLink).click((e) => {
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: (data) => {
                    $(`#post-${data.data.post._id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: 'Post Deleted',
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                },
                error: (err) => {
                    new Noty({
                        theme: 'relax',
                        text: 'Error',
                        type: 'error',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                }
            });
        });
    }

    createPost();
}
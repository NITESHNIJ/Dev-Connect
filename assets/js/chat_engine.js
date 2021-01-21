class ChatEngine {
    constructor(chatBoxId, userEmail) {
        this.chatBoxId = chatBoxId;
        this.userEmail = userEmail;
        this.socket = io.connect('http://localhost:5000');

        if (this.userEmail) {
            this.connectionHandler();
        }
    }

    connectionHandler() {
        let self = this;
        this.socket.on('connect', () => {
            console.log('connection establisted using sockets...!');

            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: 'codeial'
            })

            self.socket.on('user_joined', (data) => {
                console.log('a user joined', data);
            });
            $('#send-message').click(function () {
                let msg = $('#chat-message-input').val();
                if (msg != '') {
                    self.socket.emit('send_message', {
                        message: msg,
                        user_email: self.userEmail,
                        chatroom: 'codeial'
                    });
                }

            });
            self.socket.on('receive_message', function (data) {
                console.log('message received', data.message);

                let newmessage = $('<li>');
                let messagetype = 'other-message';
                if (self.userEmail == data.user_email) {
                    messagetype = 'self-message';
                }
                newmessage.append($('<span>', {
                    'html': data.message
                }));
                newmessage.append($('<sub>', {
                    'html': data.user_email
                }));

                newmessage.addClass(messagetype);
                $('#chat-messages-list').append(newmessage);
            });



        })
    }
}
/* global $ */
$(document).ready(function () {
    var Bill = (function () {
        var Bill = function (data, container) {
            data.receivedDate = new Date(data.receivedDate);
            data.dueDate = new Date(data.dueDate);
            this.data = data;
            this.render();
        };
        
        Bill.prototype.render = function () {
            this.row = $('<tr class="bill">');
            var jcb = $('<input type="checkbox" class="paid jpay" title="Jon">');
            var bcb = $('<input type="checkbox" class="paid bpay" title="Birgit">');
            jcb.attr('checked', !!this.data.jpaid);
            bcb.attr('checked', this.data.bpaid);
            this.row.append('<td>' + this.data.recipient + '</td>').
                append('<td>' + this.data.amount + ' (' + (this.data.amount / 2) + ' per person)</td>').
                append('<td>' + this.data.dueDate.toDateString() + '</td>').
                append('<td>' + this.data.info + '</td>').
                append('<td>' + this.data.dueDate.toDateString() + '</td>').
                append($('<td></td>').append(jcb).append(' Jon<br/>').append(bcb).append(' Birgit')).
                append('<td>' + this.data.jmessage + '<br />' + this.data.bmessage + '</td>').
                append('<td><button class="delButton">Delete</button><button class="editButton">Edit</button></td>');
            this.row.data(this.data).appendTo('#bills');
            this.row.on('click', 'input.paid[type=checkbox]', $.proxy(cbClickHandler, this));
            this.row.on('click', 'button.editButton', $.proxy(editHandler, this));
            this.row.on('click', 'button.delButton', $.proxy(deleteHandler, this));
        };
        
        var cbClickHandler = function (e) {
            var self = this;
            var jon = $(e.target).hasClass('jpay');
            var data = this.data;
            var sendData = { _id: data._id };
            if (jon) {
                sendData.jpaid = e.target.checked;
            } else {
                sendData.bpaid = e.target.checked;
            }
            $.ajax({
                type: 'PUT',
                url: 'api/pay',
                data: sendData,
                success: function () {
                    self.row.addClass('updated');
                    setTimeout(function () {
                        self.row.removeClass('updated');
                    }, 500);
                }
            });
        };

        var editHandler = function (e) {
            var data = this.data;
            var form = $('form').get(0);
            var rDate = new Date(data.receivedDate);
            var dDate = new Date(data.dueDate);
            form.id.value = data._id;
            form.received.value = rDate.toISOString().slice(0, 10);
            form.due.value = dDate.toISOString().slice(0, 10);
            form.recipient.value = data.recipient;
            form.info.value = data.info;
            form.amount.value = data.amount;
            form.jmessage.value = data.jmessage;
            form.bmessage.value = data.bmessage;
        };

        var deleteHandler = function (e) {
            if (confirm('Are you sure that you would like to delete this bill?')) {
                var data = this.data;
                $.ajax({
                    type: 'DELETE',
                    url: 'api/bill',
                    data: { _id: data._id },
                    success: function () {
                        updateBills();
                    }
                });
            }
        };
        
        return Bill;
    }) ();
    
    function updateBills () {
        $('#bills .bill').remove();
        $.get('api/bills', function (bills) {
            bills.map(function (bill) {
                new Bill(bill);
            });
        });
    }
    updateBills();

    $('form').submit(function (e) {
        e.preventDefault();
        var update = !!this.id.value;
        var submitData = {
            received: this.received.value,
            due: this.due.value,
            recipient: this.recipient.value,
            info: this.info.value,
            amount: this.amount.value,
            jmessage: this.jmessage.value,
            bmessage: this.bmessage.value
        };
        if (update) {
            submitData._id = this.id.value;
        }
        $.ajax({
            type: update ? 'PUT' : 'POST',
            url: 'api/bill',
            data: submitData,
            success: function () {
                updateBills(submitData);
            }
        });
        this.reset();
        return false;
    });
});
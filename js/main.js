var url = '';

g_device = 0;

on_mode_selected = function() {
	if($('#mode').val()=='normal'){
		url = 'http://127.0.0.1:8086/ble?callback=?';
	}else{
		url = 'http://www.gatt.io:8080/server?callback=?';
	}

    console.log('now in ' + $('#mode').val() + ' mode; using server: ' + url);
}

select_device = function(device) {
    g_device = device;

    console.log('selected device: ' + JSON.stringify(g_device));
}

$(function(){
	$('#mode').change(on_mode_selected);

    on_mode_selected();

	$('#scan-button').click(function() {
  	    var params = {
		    address : "local",
		    resource : "/devices/nearby",
		    operation : "read",
		    settings : "low latency"
	    };

        $('#device-list').html("searching");

	    $.getJSON(url,params,function(data){
		    var devices = data['device_list'];

            if (devices.length == 0) {
                $('#device-list').html('no device found');
                return;
            }

            html_str = "";
		    for(var i=0;i<devices.length;i++){
			    var device = devices[i];
                var name = device.name;
                var addr = device.address;
                var rssi = device.RSSI;

                html_str += '<label for="device-' + i + '">' + name + ' ' + addr + ' ' + '</label><input type="radio" name="device" id="device-' + i + '" value="' + i + '"></input>'
		    }

            $('#device-list').html(html_str);

            $('input[type="radio"]').checkboxradio();

		    for(var i=0;i<devices.length;i++) {
                (function (device) {
                    $('#device-' + i).click(function() {
                        select_device(device);
                    });
                })(devices[i]);
            }
        });
    });

	$('#temperature').click(function() {
	    if(g_device != 0) {
	        var params = {
	            address : g_device.address,
	            resource : "/sensors/temperature",
	            operation : "read"
	        };

	        $.getJSON(url, params, function(data){
	            $('#temperature-value').html(data['value']+" C");
	        });
	    }
	});

	$('#beep-button').click(function() {
	    if(g_device != 0) {
	        var params = {
	            address : g_device.address,
	            resource : "/peripherals/buzzer",
	            operation : "write",
				value : "5s"
	        };

	        $.getJSON(url, params, function(data){
	        });
	    }
	}); 
});

from .thermal_stream_interface import iThermalStream

class TemperatureSensor():

    def set_thermal_stream(self, thermal_stream: iThermalStream):
        self._thermal_stream = thermal_stream

    @property
    def temperature(self):
        return self._thermal_stream.daily_temperature
    
    @property
    def is_warming(self):
        return self._thermal_stream.direction_of_change > 0
    
class TemperatureSensor():

    def register_temperature(self, temperature: int, direction_of_change: int):
        self._temperature = temperature
        self._direction_of_change = direction_of_change

    @property
    def temperature(self):
        return self._temperature
    
    @property
    def direction_of_change(self):
        return self._direction_of_change
    
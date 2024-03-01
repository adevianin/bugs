from ..base.ant_body import AntBody

class MaleAntBody(AntBody):
    
    def fly_nuptial_flight(self):
        if self.is_in_nest:
            self.get_out_of_nest()
        
        self.events.emit('flew_nuptial_flight')
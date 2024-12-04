from ..base.ant_body import AntBody

class MaleAntBody(AntBody):
    
    def fly_nuptial_flight(self):
        if self.is_in_nest:
            self.get_out_of_nest()

        if self.am_i_in_hibernation():
            self.exit_hibernation()
        
        self.events.emit('flew_nuptial_flight')
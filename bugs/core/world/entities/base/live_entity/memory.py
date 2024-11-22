class Memory():

    def __init__(self, records = None):
        self._records = records or {}

    @property
    def records(self):
        return self._records
    
    def save_flag(self, flag_name: str, value: bool):
        self.save(flag_name, bool(value))

    def read_flag(self, flag_name: str):
        return bool(self.read(flag_name))

    def save(self, record_name: str, data, expired_in: int = None):
        self._records[record_name] = { 'data': data,  'expired_in': expired_in}
    
    def read(self, record_name: str):
        if record_name in self._records:
            return self._records[record_name]['data']
        else:
            return None
        
    def clear(self, record_name: str):
        if record_name in self._records:
            del self._records[record_name]

    def treat_records(self):
        record_names = self._records.keys()
        record_names_for_delete = []

        for record_name in record_names:
            record = self._records[record_name]

            if record['expired_in'] is not None:
                if record['expired_in'] == 0:
                    record_names_for_delete.append(record_name)
                else:
                    record['expired_in'] -= 1
        
        for record_name_for_delete in record_names_for_delete:
            del self._records[record_name_for_delete]

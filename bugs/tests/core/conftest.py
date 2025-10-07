from unittest.mock import MagicMock
import pytest
from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.ant.base.ant_mind import AntMind
from core.world.entities.ant.base.ant_stats import AntStats
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.base.stats_types import StatsTypes
from core.world.entities.thought.thought_factory import ThoughtFactory
from core.world.entities.nest.nest import Nest
from core.world.entities.ant.base.guardian_behaviors import GuardianBehaviors
from core.world.utils.event_emiter import EventEmitter

@pytest.fixture
def event_emitter_mock_factory():
    def create_mock():
        return MagicMock(spec=EventEmitter)
    return create_mock

@pytest.fixture
def ant_stats_mock_factory():
    def create_ant_stats_mock(max_hp, hp_regen_rate, distance_per_step, sight_distance, strength, defence, appetite, min_temperature, life_span):
        stats_mock = MagicMock(spec=AntStats)
        stats_mock.type = StatsTypes.ANT
        stats_mock.max_hp = max_hp
        stats_mock.hp_regen_rate = hp_regen_rate
        stats_mock.distance_per_step = distance_per_step
        stats_mock.sight_distance = sight_distance
        stats_mock.strength = strength
        stats_mock.defence = defence
        stats_mock.appetite = appetite
        stats_mock.min_temperature = min_temperature
        stats_mock.life_span = life_span
        return stats_mock
    return create_ant_stats_mock

@pytest.fixture
def ant_body_mock_factory(event_emitter_mock_factory, ant_stats_mock_factory):
    def create_ant_body_mock(max_hp=100, hp_regen_rate=3, distance_per_step=32, sight_distance=200, strength=15, defence=10, appetite=5, min_temperature=0, life_span=7000):
        body = MagicMock(spec=AntBody)
        body.events = event_emitter_mock_factory()
        body.stats = ant_stats_mock_factory(max_hp, hp_regen_rate, distance_per_step, sight_distance, strength, defence, appetite, min_temperature, life_span)
        body.sayer = event_emitter_mock_factory()
        body.memory = MagicMock()
        return body
    return create_ant_body_mock

@pytest.fixture
def ant_thought_mock_factory():
    def create_thought(is_canceled=False, is_done=False, is_completed=False, sayback=None, results=None):
        thought = MagicMock()
        thought.is_canceled = is_canceled
        thought.is_done = is_done
        thought.is_completed = is_completed
        thought.sayback = sayback
        thought.results = results
        return thought
    return create_thought

@pytest.fixture
def ant_mind_factory(ant_body_mock_factory):
    def create_ant_mind(is_auto_thought_generation=True, is_in_operation=False, guardian_behavior=GuardianBehaviors.NONE, 
                        is_cooperative=False, thought_factory_mock=None, ant_body_mock=None) -> AntMind:
        if ant_body_mock is None:
            ant_body_mock = ant_body_mock_factory()
        if thought_factory_mock is None:
            thought_factory_mock = MagicMock(spec=ThoughtFactory)
        home_nest = MagicMock(spec=Nest)
        return AntMind(ant_body_mock, thought_factory_mock, is_auto_thought_generation, home_nest, is_in_operation, guardian_behavior, is_cooperative)
    
    return create_ant_mind
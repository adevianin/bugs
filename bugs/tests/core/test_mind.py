from unittest.mock import MagicMock
from core.world.entities.ant.base.guardian_behaviors import GuardianBehaviors

def test_ant_free_mind(ant_mind_factory, ant_thought_mock_factory):
    ant_mind = ant_mind_factory(True, False, GuardianBehaviors.NONE, False)
    thought1 = ant_thought_mock_factory(True, False, True)
    thought2 = ant_thought_mock_factory(False, True, True)
    thought3 = ant_thought_mock_factory(False, False, False)
    thought4 = ant_thought_mock_factory(False, False, False)

    ant_mind.set_thoughts([thought1, thought3, thought2, thought4])
    
    ant_mind.free_mind()

    assert thought1.cancel.call_count == 0
    assert thought2.cancel.call_count == 0
    assert thought3.cancel.call_count == 1
    assert thought4.cancel.call_count == 1
    assert len(ant_mind.thoughts) == 4

def test_ant_register_thought(ant_mind_factory, ant_thought_mock_factory):
    thought = ant_thought_mock_factory()

    thought_factory_mock = MagicMock()
    thought_factory_mock.build_collect_food_new.return_value = thought

    ant_mind = ant_mind_factory(True, False, GuardianBehaviors.NONE, False, thought_factory_mock)
    ant_mind.collect_food()

    assert len(ant_mind.thoughts) == 1
    assert thought.setup.call_count == 1

def test_ant_immediately_register_thought_with_delay(ant_mind_factory, ant_thought_mock_factory):
    thought = ant_thought_mock_factory()

    thought_factory_mock = MagicMock()
    thought_factory_mock.build_defend_myself_new.return_value = thought

    ant_mind = ant_mind_factory(True, False, GuardianBehaviors.NONE, False, thought_factory_mock)

    thought1 = ant_thought_mock_factory(True, False, True)
    thought2 = ant_thought_mock_factory(False, True, True)
    current_thought = ant_thought_mock_factory(False, False, False)
    current_thought.can_be_delayed.return_value = True
    thought4 = ant_thought_mock_factory(False, False, False)

    ant_mind.set_thoughts([thought1, thought2, current_thought, thought4])

    ant_mind.defend_myself()

    assert len(ant_mind.thoughts) == 5
    assert current_thought.delay.call_count == 1
    assert thought is ant_mind.thoughts[0]
    assert thought.setup.call_count == 1

def test_ant_immediately_register_thought_with_cancel(ant_mind_factory, ant_thought_mock_factory):
    thought = ant_thought_mock_factory()

    thought_factory_mock = MagicMock()
    thought_factory_mock.build_defend_myself_new.return_value = thought

    ant_mind = ant_mind_factory(True, False, GuardianBehaviors.NONE, False, thought_factory_mock)

    thought1 = ant_thought_mock_factory(True, False, True)
    thought2 = ant_thought_mock_factory(False, True, True)
    current_thought = ant_thought_mock_factory(False, False, False)
    current_thought.can_be_delayed.return_value = False
    thought4 = ant_thought_mock_factory(False, False, False)

    ant_mind.set_thoughts([thought1, thought2, current_thought, thought4])

    ant_mind.defend_myself()

    assert len(ant_mind.thoughts) == 5
    assert current_thought.cancel.call_count == 1
    assert thought is ant_mind.thoughts[0]
    assert thought.setup.call_count == 1

def test_ant_asap_register_thought_with_delay(ant_mind_factory, ant_thought_mock_factory):
    thought = ant_thought_mock_factory()

    thought_factory_mock = MagicMock()
    thought_factory_mock.build_hibernation_new.return_value = thought

    ant_mind = ant_mind_factory(True, False, GuardianBehaviors.NONE, False, thought_factory_mock)

    thought1 = ant_thought_mock_factory(True, False, True)
    thought2 = ant_thought_mock_factory(False, True, True)
    current_thought = ant_thought_mock_factory(False, False, False)
    current_thought.can_be_delayed.return_value = True
    thought4 = ant_thought_mock_factory(False, False, False)

    ant_mind.set_thoughts([thought1, thought2, current_thought, thought4])

    ant_mind.hibernate(True)

    assert len(ant_mind.thoughts) == 5
    assert current_thought.delay.call_count == 1
    assert thought is ant_mind.thoughts[0]
    assert thought.setup.call_count == 1

def test_ant_asap_register_thought_with_cant_delay(ant_mind_factory, ant_thought_mock_factory):
    thought = ant_thought_mock_factory()

    thought_factory_mock = MagicMock()
    thought_factory_mock.build_hibernation_new.return_value = thought

    ant_mind = ant_mind_factory(True, False, GuardianBehaviors.NONE, False, thought_factory_mock)

    thought1 = ant_thought_mock_factory(True, False, True)
    thought2 = ant_thought_mock_factory(False, True, True)
    current_thought = ant_thought_mock_factory(False, False, False)
    current_thought.can_be_delayed.return_value = False
    thought4 = ant_thought_mock_factory(False, False, False)

    ant_mind.set_thoughts([thought1, thought2, current_thought, thought4])

    ant_mind.hibernate(True)

    assert len(ant_mind.thoughts) == 5
    assert current_thought.delay.call_count == 0
    assert thought is ant_mind.thoughts[2]
    assert thought.setup.call_count == 1

def test_ant_handling_done_thoughts(ant_mind_factory, ant_thought_mock_factory, ant_body_mock_factory):
    ant_body_mock = ant_body_mock_factory()
    ant_mind = ant_mind_factory(is_auto_thought_generation=False, ant_body_mock=ant_body_mock)

    thought1 = ant_thought_mock_factory(True, False, True)
    thought2 = ant_thought_mock_factory(False, True, True, 'sayback', 'some_results')
    thought3 = ant_thought_mock_factory(False, False, False)
    thought4 = ant_thought_mock_factory(False, False, False)
    thought5 = ant_thought_mock_factory(False, True, True, None, 'some_results2')

    ant_mind.set_thoughts([thought1, thought2, thought3, thought4, thought5])

    ant_mind.do_step()

    assert thought1 not in ant_mind.thoughts
    assert thought2 not in ant_mind.thoughts
    assert thought3 in ant_mind.thoughts
    assert thought4 in ant_mind.thoughts
    assert thought5 not in ant_mind.thoughts
    ant_body_mock.say.assert_called_once_with('sayback', 'some_results')



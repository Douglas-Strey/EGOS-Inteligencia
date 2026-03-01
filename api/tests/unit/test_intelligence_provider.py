from pytest import MonkeyPatch

from icarus.config import settings
from icarus.services import intelligence_provider as provider_module


def test_falls_back_to_community_when_advanced_modules_missing(
    monkeypatch: MonkeyPatch,
) -> None:
    original_tier = settings.product_tier
    try:
        monkeypatch.setattr(settings, "product_tier", "advanced")
        monkeypatch.setattr(
            provider_module,
            "_advanced_modules_available",
            lambda: False,
        )
        provider_module._PROVIDER_CACHE.clear()

        provider = provider_module.get_default_provider()

        assert isinstance(provider, provider_module.CommunityIntelligenceProvider)
    finally:
        provider_module._PROVIDER_CACHE.clear()
        settings.product_tier = original_tier


def test_keeps_advanced_when_modules_are_available(
    monkeypatch: MonkeyPatch,
) -> None:
    original_tier = settings.product_tier
    try:
        monkeypatch.setattr(settings, "product_tier", "advanced")
        monkeypatch.setattr(
            provider_module,
            "_advanced_modules_available",
            lambda: True,
        )
        provider_module._PROVIDER_CACHE.clear()

        provider = provider_module.get_default_provider()

        assert isinstance(provider, provider_module.AdvancedIntelligenceProvider)
    finally:
        provider_module._PROVIDER_CACHE.clear()
        settings.product_tier = original_tier

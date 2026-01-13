package data.hullmods;

import com.fs.starfarer.api.combat.BaseHullMod;
import com.fs.starfarer.api.combat.MutableShipStatsAPI;
import com.fs.starfarer.api.combat.ShipAPI.HullSize;
import com.fs.starfarer.api.impl.campaign.ids.Stats;

public class SolarShielding extends BaseHullMod {

	public static final float CORONA_EFFECT_REDUCTION = 0.25f;
	public static final float BEAM_DAMAGE_REDUCTION = 0.9f;
	
	public void applyEffectsBeforeShipCreation(HullSize hullSize, MutableShipStatsAPI stats, String id) {
		stats.getBeamDamageTakenMult().modifyMult(id, BEAM_DAMAGE_REDUCTION);
		stats.getDynamic().getStat(Stats.CORONA_EFFECT_MULT).modifyMult(id, CORONA_EFFECT_REDUCTION);
	}
	
	public String getDescriptionParam(int index, HullSize hullSize) {
		if (index == 0) return "" + (int) ((1f - CORONA_EFFECT_REDUCTION) * 100f);
		if (index == 1) return "" + (int) ((1f - BEAM_DAMAGE_REDUCTION) * 100f);
		return null;
	}


}

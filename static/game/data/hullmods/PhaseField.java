package data.hullmods;

import com.fs.starfarer.api.combat.BaseHullMod;
import com.fs.starfarer.api.combat.MutableShipStatsAPI;
import com.fs.starfarer.api.combat.ShipAPI.HullSize;

@SuppressWarnings("unchecked")
public class PhaseField extends BaseHullMod {

	//private static final float PROFILE_DECREASE = 75f;
	
	public void applyEffectsBeforeShipCreation(HullSize hullSize, MutableShipStatsAPI stats, String id) {
		//stats.getSensorProfile().modifyMult(id, 1f - PROFILE_DECREASE * 0.01f);
		stats.getSensorProfile().modifyMult(id, 0f);
	}
	
	public String getDescriptionParam(int index, HullSize hullSize) {
		//if (index == 0) return "" + (int) PROFILE_DECREASE;
		return null;
	}


}

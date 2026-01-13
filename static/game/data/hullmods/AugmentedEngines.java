package data.hullmods;

import java.util.HashMap;
import java.util.Map;

import com.fs.starfarer.api.combat.BaseHullMod;
import com.fs.starfarer.api.combat.MutableShipStatsAPI;
import com.fs.starfarer.api.combat.ShipAPI;
import com.fs.starfarer.api.combat.ShipAPI.HullSize;

public class AugmentedEngines extends BaseHullMod {

	public static final float REPAIR_PENALTY = 25f;
	
	
	private static Map mag = new HashMap();
	static {
		mag.put(HullSize.FRIGATE, 50f);
		mag.put(HullSize.DESTROYER, 35f);
		mag.put(HullSize.CRUISER, 30f);
		mag.put(HullSize.CAPITAL_SHIP, 25f);
	}
	
	private static final int BURN_LEVEL_BONUS = 1;
	
	private static final int STRENGTH_PENALTY = 50;
	private static final int PROFILE_PENALTY = 50;
	
	public void applyEffectsBeforeShipCreation(HullSize hullSize, MutableShipStatsAPI stats, String id) {
		//stats.getMaxSpeed().modifyFlat(id, (Float) mag.get(hullSize));
		//stats.getCombatEngineRepairTimeMult().modifyPercent(id, REPAIR_PENALTY);
		
		stats.getSensorProfile().modifyPercent(id, PROFILE_PENALTY);
		stats.getSensorStrength().modifyMult(id, 1f - STRENGTH_PENALTY * 0.01f);
	
		stats.getMaxBurnLevel().modifyFlat(id, BURN_LEVEL_BONUS);
	}
	
	public String getDescriptionParam(int index, HullSize hullSize) {
//		if (index == 0) return "" + ((Float) mag.get(HullSize.FRIGATE)).intValue();
//		if (index == 1) return "" + ((Float) mag.get(HullSize.DESTROYER)).intValue();
//		if (index == 2) return "" + ((Float) mag.get(HullSize.CRUISER)).intValue();
//		if (index == 3) return "" + ((Float) mag.get(HullSize.CAPITAL_SHIP)).intValue();
//		if (index == 4) return "" + BURN_LEVEL_BONUS;
//		if (index == 5) return "" + STRENGTH_PENALTY;
//		if (index == 6) return "" + PROFILE_PENALTY;
		if (index == 0) return "" + BURN_LEVEL_BONUS;
		if (index == 1) return "" + STRENGTH_PENALTY;
		if (index == 2) return "" + PROFILE_PENALTY;
		return null;
	}

	@Override
	public boolean isApplicableToShip(ShipAPI ship) {
		//return !ship.getVariant().getHullMods().contains("unstable_injector");
		return true;
	}

	@Override
	public void advanceInCombat(ShipAPI ship, float amount) {
//		if (ship.getEngineController().isAccelerating() || 
//				ship.getEngineController().isAcceleratingBackwards() ||
//				ship.getEngineController().isDecelerating() ||
//				ship.getEngineController().isTurningLeft() ||
//				ship.getEngineController().isTurningRight() ||
//				ship.getEngineController().isStrafingLeft() ||
//				ship.getEngineController().isStrafingRight()) {
//			ship.getEngineController().fadeToOtherColor(new Color(255,0,255,255), null, 1f, 0.5f);
//			ship.getEngineController().extendFlame(1.25f, 1f, 2f);
//		}
	}

	

}

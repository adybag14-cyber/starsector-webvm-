package data.hullmods;

import com.fs.starfarer.api.combat.BaseHullMod;
import com.fs.starfarer.api.combat.MutableShipStatsAPI;
import com.fs.starfarer.api.combat.ShieldAPI;
import com.fs.starfarer.api.combat.ShipAPI;
import com.fs.starfarer.api.combat.ShieldAPI.ShieldType;
import com.fs.starfarer.api.combat.ShipAPI.HullSize;

public class FrontShieldEmitter extends BaseHullMod {

	public static final float ARC_BONUS = 100f;
	public static final float UPKEEP_BONUS = 50f;
	
	public void applyEffectsBeforeShipCreation(HullSize hullSize, MutableShipStatsAPI stats, String id) {
		stats.getShieldArcBonus().modifyPercent(id, ARC_BONUS);
		stats.getShieldUpkeepMult().modifyMult(id, 1f - UPKEEP_BONUS * 0.01f);
	}
	
	public void applyEffectsAfterShipCreation(ShipAPI ship, String id) {
		ShieldAPI shield = ship.getShield();
		if (shield != null) {
			shield.setType(ShieldType.FRONT);
		}
	}

	
	public String getDescriptionParam(int index, HullSize hullSize) {
		if (index == 0) return "" + (int) ARC_BONUS;
		if (index == 1) return "" + (int) UPKEEP_BONUS;
		return null;
	}

	public boolean isApplicableToShip(ShipAPI ship) {
		return ship != null && ship.getShield() != null && (ship.getHullSpec().getDefenseType() == ShieldType.OMNI ||
				(ship.getHullSpec().getDefenseType() == ShieldType.FRONT && 
						ship.getVariant().getHullMods().contains("adaptiveshields")));

	}
	
	public String getUnapplicableReason(ShipAPI ship) {
		if (ship == null || ship.getShield() == null) {
			return "Ship has no shields";
		}
		
		if (ship.getHullSpec().getDefenseType() == ShieldType.FRONT) {
			return "Ship already has front shields";
		}
		
		if (ship.getVariant().getHullMods().contains("adaptiveshields")) {
			return "Incompatible with Omni Shield Emitter";
		}
		
		return null;
	}
	

}





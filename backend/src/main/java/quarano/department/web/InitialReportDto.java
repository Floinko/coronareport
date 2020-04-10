package quarano.department.web;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class InitialReportDto {

	private LocalDateTime dateTime;
	private Boolean min15MinutesContactWithC19Pat;
	private Boolean nursingActionOnC19Pat;
	private Boolean directContactWithLiquidsOfC19pat;
	private Boolean flightPassengerCloseRowC19Pat;
	private Boolean flightCrewMemberWithC19Pat;
	private Boolean belongToMedicalStaff;
	private Boolean belongToNursingStaff;
	private Boolean belongToLaboratoryStaff;
	private Boolean familyMember;
	private Boolean isPassengerOnSameFlightAsPatient;
	private String OtherContactType;
	private LocalDate dayOfFirstSymptoms;
}

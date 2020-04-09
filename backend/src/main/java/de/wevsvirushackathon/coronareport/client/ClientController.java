package de.wevsvirushackathon.coronareport.client;

import java.text.ParseException;
import java.util.UUID;

import javax.persistence.EntityNotFoundException;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

@RestController
@RequestMapping("/client")
public class ClientController {

	private ClientRepository clientRepository;
	private ModelMapper modelMapper;

	@Autowired
	public ClientController(ClientRepository clientRepository, ModelMapper modelMapper) {
		this.clientRepository = clientRepository;
		this.modelMapper = modelMapper;
	}

	@PostMapping("/register")
	public ResponseEntity<String> registerClient(@RequestBody ClientDto clientDto) {
		Client client = this.registerClientAndCreateExternalId(clientDto);

		return ResponseEntity.ok(client.getClientCode());
	}

	/**
	 * 
	 * @param clientCode
	 * @return
	 */
	@GetMapping("/{clientCode}")
	public ResponseEntity<ClientDto> getClient(@PathVariable String clientCode) {
		Client client = this.clientRepository.findByClientCode(clientCode);
		if (client == null) {
			throw new EntityNotFoundException("Client with clientCode '" + clientCode + "' does not exist.");
		}
		return ResponseEntity.ok(modelMapper.map(client, ClientDto.class));
	}

	
	/**
	 * Retrieves information of the tracked case, that is currently logged in
	 * 
	 * @return a clientDto of the authenticated user
	 * @throws ParseException
	 */
	@ApiOperation(value = "Get information of logged in user", response = ClientDto.class)
	@ApiResponses(value = { @ApiResponse(code = 200, message = "OK"),
			@ApiResponse(code = 403, message = "Not authorized, if there is no session"),
			@ApiResponse(code = 404, message = "Bad request"),
			@ApiResponse(code = 500, message = "Internal Server error") })	
	@GetMapping("/me")
	public ResponseEntity<ClientDto> getMe(Authentication authentication) {
			
		// get client of authenticated account
		long clientId = Long.parseLong(authentication.getDetails().toString());
		final Client client = this.clientRepository.findById(clientId)
				.orElseThrow(() -> new MissingClientException(
						"No Client found for username '" + authentication.getPrincipal(),
						authentication.getPrincipal().toString() + "'"));

		// map to dto
		ClientDto clientDto = modelMapper.map(client, ClientDto.class);

		return ResponseEntity.ok(clientDto);
	}

	private Client registerClientAndCreateExternalId(ClientDto clientDto) {
		Client newClient = modelMapper.map(clientDto, Client.class);
		newClient.setClientCode(createNewClientId());
		this.clientRepository.save(newClient);
		return newClient;
	}

	/**
	 * Creates a new unique client id
	 * 
	 * @return
	 */
	private String createNewClientId() {
		Client possiblyExistingClient;
		String newClientCode;
		do {
			newClientCode = UUID.randomUUID().toString();
			possiblyExistingClient = this.clientRepository.findByClientCode(newClientCode);
		} while (possiblyExistingClient != null);
		return newClientCode;
	}
}

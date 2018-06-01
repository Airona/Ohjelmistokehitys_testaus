package fi.swd.projektityo.domain;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import fi.swd.projektityo.ProjektityoApplication;

@Component
public class DatabaseLoader implements CommandLineRunner {

	private static final Logger log = LoggerFactory.getLogger(ProjektityoApplication.class);
	
	
	private final UserRepository urepository;
	private final ImageRepository irepository;
	
	@Autowired
	public DatabaseLoader(UserRepository urepository, ImageRepository irepository) {
		this.urepository = urepository;
		this.irepository = irepository;
	}

	@Override
	public void run(String... strings) throws Exception {
		//create users
		User user1 = new User(1L,"user", "passwordhash", "user@example.com", "USER");
		User user2 = new User(0L,"admin", "passwordhash", "admin@example.com", "ADMIN");
		urepository.save(user1);
		urepository.save(user2);
		
		// create testing data
		//irepository.save(new Image("Name","user","Picture 1","2017-11-16-004350118","url"));
	}
}
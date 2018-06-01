package fi.swd.projektityo.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	@Column(name = "game", nullable = false)
	private String game;
	
	@Column(name = "user", nullable = false)
	private String user;
	
	@Column(name = "name")
	private String name;
	
	private String date;
	
	private String url;
	
	public Image() {
		super();
	}

	public Image(String game, String user, String name, String date, String url) {
		super();
		this.game = game;
		this.user = user;
		this.name = name;
		this.date = date;
		this.url = url;
	}

	public Image(String date, String url) {
		super();
		this.date = date;
		this.url = url;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getGame() {
		return game;
	}

	public void setGame(String game) {
		this.game = game;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	@Override
	public String toString() {
		return "Image [id=" + id + ", game=" + game + ", user=" + user + ", name=" + name + ", date=" + date + ", url="
				+ url + "]";
	}
	
}
